#include "building/Building.h"

Building::Building(int x, int y, BuildingType type)
    : x(x)
    , y(y)
    , type(type)
{
    initializeFromType();
}

std::string Building::getTypeName() const {
    switch (type) {
        case BuildingType::HOUSE:     return "House";
        case BuildingType::TOWER:     return "Tower";
        case BuildingType::WAREHOUSE: return "Warehouse";
        default:                      return "Unknown";
    }
}

void Building::initializeFromType() {
    switch (type) {
        case BuildingType::HOUSE:
            width = 2;
            height = 2;
            buildHeight = 40.0f;
            topColor = glm::vec4(0.8f, 0.2f, 0.2f, 1.0f);
            leftColor = glm::vec4(0.6f, 0.15f, 0.15f, 1.0f);
            rightColor = glm::vec4(0.7f, 0.17f, 0.17f, 1.0f);
            break;
            
        case BuildingType::TOWER:
            width = 1;
            height = 1;
            buildHeight = 80.0f;
            topColor = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
            leftColor = glm::vec4(0.3f, 0.3f, 0.3f, 1.0f);
            rightColor = glm::vec4(0.4f, 0.4f, 0.4f, 1.0f);
            break;
            
        case BuildingType::WAREHOUSE:
            width = 3;
            height = 3;
            buildHeight = 30.0f;
            topColor = glm::vec4(0.6f, 0.4f, 0.2f, 1.0f);
            leftColor = glm::vec4(0.45f, 0.3f, 0.15f, 1.0f);
            rightColor = glm::vec4(0.52f, 0.35f, 0.17f, 1.0f);
            break;
    }
}
