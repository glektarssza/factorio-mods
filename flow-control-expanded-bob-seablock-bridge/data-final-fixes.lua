OSM.mod = 'Flow Control for Bob\'s Logistics/Sea Block Bridge'

-- Remove unlocks from new technology
OSM.lib.technology_remove_unlock("flowbob-topup-valve-2", "flow_control_valves_tech")
OSM.lib.technology_remove_unlock("flowbob-check-valve", "flow_control_valves_tech")
OSM.lib.technology_remove_unlock("flowbob-overflow-valve", "flow_control_valves_tech")
OSM.lib.technology_remove_unlock("flowbob-topup-valve-1", "flow_control_valves_tech")

-- Restore unlocks on original technology
OSM.lib.technology_add_unlock("flowbob-topup-valve-1", "angels-fluid-control")
OSM.lib.technology_add_unlock("flowbob-check-valve", "angels-fluid-control")
OSM.lib.technology_add_unlock("flowbob-overflow-valve", "angels-fluid-control")

-- Delete Flow Control technology
OSM.lib.disable_prototype("technology", "flow_control_valves_tech")

-- Restore original recipe for all valves
local recipe = nil
recipe = OSM.lib.get_recipe_prototype("flowbob-topup-valve-1")
recipe.ingredients = {
    {type = "item", name = "basic-circuit-board", amount = 1},
    {type = "item", name = "pipe", amount = 1},
}
recipe = OSM.lib.get_recipe_prototype("flowbob-check-valve")
recipe.ingredients = {
    {type = "item", name = "basic-circuit-board", amount = 1},
    {type = "item", name = "pipe", amount = 1},
}
recipe = OSM.lib.get_recipe_prototype("flowbob-overflow-valve")
recipe.ingredients = {
    {type = "item", name = "basic-circuit-board", amount = 1},
    {type = "item", name = "pipe", amount = 1},
}

OSM.mod = nil
