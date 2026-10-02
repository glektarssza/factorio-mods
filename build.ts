import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const copy = (src: string, dest: string) => {
    if (!fs.existsSync(src)) {
        throw new Error(`${src} does not exist`);
    }
    const srcStat = fs.statSync(src);

    if (!fs.existsSync(dest) && srcStat.isDirectory()) {
        fs.mkdirSync(dest);
    } else if (!fs.existsSync(dest) && srcStat.isFile()) {
        fs.writeFileSync(dest, "", {
            encoding: "utf8",
        });
    }
    const destStat = fs.statSync(dest);
    //-- Overwrite existing file
    if (srcStat.isFile() && destStat.isFile()) {
        fs.copyFileSync(src, dest);
        return;
    }
    //-- Copy file to directory
    if (srcStat.isFile() && destStat.isDirectory()) {
        copy(src, path.resolve(dest, path.basename(src)));
        return;
    }
    //-- Copy directory to directory
    if (srcStat.isDirectory() && destStat.isDirectory()) {
        const files = fs.readdirSync(src);
        files.forEach((file) => {
            copy(path.resolve(src, file), path.resolve(dest, file));
        });
        return;
    }
    throw new Error(`Cannot copy ${src} to ${dest}`);
};

const removeDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        return;
    }
    const stat = fs.statSync(dir);
    if (stat.isFile()) {
        fs.unlinkSync(dir);
        return;
    } else if (stat.isDirectory()) {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            removeDir(path.resolve(dir, file));
        });
        fs.rmdirSync(dir);
    }
};

const build = (modName: string) => {
    const modPath = path.resolve(root, modName);
    const modStaging = path.resolve(staging, modName);

    if (!fs.existsSync(modPath)) {
        throw new Error(`Mod ${modName} does not exist`);
    }
    const modInfo = require(path.resolve(modPath, "info.json"));
    const modVersion = modInfo.version;
    const modArchiveName = `${modName}_${modVersion}.zip`;

    if (!fs.existsSync(staging)) {
        fs.mkdirSync(staging);
    }
    if (!fs.existsSync(modStaging)) {
        fs.mkdirSync(modStaging);
    }

    copy(modPath, modStaging);
    copy(readme, path.resolve(modStaging, "README.md"));
    copy(license, path.resolve(modStaging, "LICENSE.md"));

    if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist);
    }

    const command = `7z a -tzip -mx=9 -r ${path.resolve(
        dist,
        modArchiveName
    )} ${modStaging}`;

    execSync(command, {
        stdio: "inherit",
        encoding: "utf8",
    });

    removeDir(modStaging);
};

const root = path.resolve(__dirname);
const readme = path.resolve(root, "README.md");
const license = path.resolve(root, "LICENSE.md");
const staging = path.resolve(root, "staging");
const dist = path.resolve(root, "dist");
let modNameArg: string | null = null;

process.argv.forEach((arg) => {
    if (arg.includes("node") || arg.includes(".js")) {
        return;
    }
    if (modNameArg === null) {
        modNameArg = arg;
    } else {
        throw new Error("Only one mod name can be specified");
    }
});

if (modNameArg === null) {
    throw new Error("No mod name specified");
}

if (modNameArg === "*") {
    const modNames = fs.readdirSync(root);
    modNames.forEach((modName: string) => {
        const stat = fs.statSync(path.resolve(root, modName));
        if (!stat.isDirectory()) {
            return;
        }
        if (
            modName === "staging" ||
            modName === "dist" ||
            modName === ".vscode" ||
            modName === ".git"
        ) {
            return;
        }
        build(modName);
    });
} else {
    build(modNameArg);
}

removeDir(staging);
