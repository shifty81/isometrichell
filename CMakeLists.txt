cmake_minimum_required(VERSION 3.10)
project(TheDailyGrind VERSION 1.0)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add compile options
if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -pedantic)
endif()

# Optional: Setup external map editors (TileZed/WorldEd) if archives are present
option(SETUP_EDITORS "Automatically setup TileZed/WorldEd from archives" OFF)
if(SETUP_EDITORS)
    message(STATUS "Checking for editor archives...")
    execute_process(
        COMMAND ${CMAKE_SOURCE_DIR}/tools/setup-editors.sh
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        RESULT_VARIABLE SETUP_RESULT
    )
    if(SETUP_RESULT EQUAL 0)
        message(STATUS "Editor setup complete")
    else()
        message(WARNING "Editor setup failed or archives not found")
    endif()
endif()

# Find OpenGL
find_package(OpenGL REQUIRED)
if(NOT OPENGL_FOUND)
    message(FATAL_ERROR 
        "OpenGL not found!\n"
        "Please install OpenGL development libraries:\n"
        "  Ubuntu/Debian: sudo apt-get install libopengl-dev libgl-dev libglu1-mesa-dev\n"
        "  Fedora/RHEL: sudo dnf install mesa-libGL-devel mesa-libGLU-devel\n"
        "  Arch: sudo pacman -S mesa glu\n"
    )
endif()

# GLFW
find_package(glfw3 3.3 QUIET)
if(NOT glfw3_FOUND)
    message(STATUS "GLFW not found, will be fetched from source")
    include(FetchContent)
    FetchContent_Declare(
        glfw
        GIT_REPOSITORY https://github.com/glfw/glfw.git
        GIT_TAG 3.3.8
    )
    set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
    set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
    set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(glfw)
endif()

# GLAD (will be included in source)
set(GLAD_SOURCES
    cpp/external/glad/src/glad.c
    cpp/external/glad/include/glad/glad.h
    cpp/external/glad/include/KHR/khrplatform.h
)

# GLM
find_package(glm QUIET)
if(NOT glm_FOUND)
    message(STATUS "GLM not found, will be fetched from source")
    include(FetchContent)
    FetchContent_Declare(
        glm
        GIT_REPOSITORY https://github.com/g-truc/glm.git
        GIT_TAG 1.0.1  # Use newer version with CMake 3.10+ support
    )
    FetchContent_MakeAvailable(glm)
endif()

# stb_image (header-only, included in source)
set(STB_IMAGE_INCLUDE cpp/external/stb)

# Include directories
include_directories(
    ${OPENGL_INCLUDE_DIRS}
    ${CMAKE_CURRENT_SOURCE_DIR}/cpp/include
    ${CMAKE_CURRENT_SOURCE_DIR}/cpp/external/glad/include
    ${CMAKE_CURRENT_SOURCE_DIR}/cpp/external/stb
)

# Source files
set(ENGINE_SOURCES
    cpp/src/main.cpp
    cpp/src/engine/Engine.cpp
    cpp/src/engine/Time.cpp
    cpp/src/engine/Input.cpp
    cpp/src/rendering/Renderer.cpp
    cpp/src/rendering/Shader.cpp
    cpp/src/rendering/Texture.cpp
    cpp/src/rendering/Camera.cpp
    cpp/src/rendering/IsometricRenderer.cpp
    cpp/src/rendering/OpenGLBackend.cpp
    cpp/src/rendering/DirectXBackend.cpp
    cpp/src/rendering/BatchRenderer.cpp
    cpp/src/rendering/Framebuffer.cpp
    cpp/src/rendering/ShaderLibrary.cpp
    cpp/src/world/Tile.cpp
    cpp/src/world/World.cpp
    cpp/src/world/Biome.cpp
    cpp/src/entities/Entity.cpp
    cpp/src/entities/Player.cpp
    cpp/src/building/Building.cpp
    cpp/src/building/BuildingSystem.cpp
    cpp/src/game/Game.cpp
    cpp/src/game/GameState.cpp
    cpp/src/ui/UIRenderer.cpp
    cpp/src/ui/MainMenu.cpp
    cpp/src/utils/IsometricUtils.cpp
    cpp/src/utils/Logger.cpp
    cpp/src/utils/NoiseGenerator.cpp
    ${GLAD_SOURCES}
)

# Header files
set(ENGINE_HEADERS
    cpp/include/engine/Engine.h
    cpp/include/engine/Time.h
    cpp/include/engine/Input.h
    cpp/include/rendering/Renderer.h
    cpp/include/rendering/Shader.h
    cpp/include/rendering/Texture.h
    cpp/include/rendering/Camera.h
    cpp/include/rendering/IsometricRenderer.h
    cpp/include/rendering/RenderBackend.h
    cpp/include/rendering/OpenGLBackend.h
    cpp/include/rendering/DirectXBackend.h
    cpp/include/rendering/BatchRenderer.h
    cpp/include/rendering/Framebuffer.h
    cpp/include/rendering/ShaderLibrary.h
    cpp/include/world/Tile.h
    cpp/include/world/World.h
    cpp/include/world/Biome.h
    cpp/include/entities/Entity.h
    cpp/include/entities/Player.h
    cpp/include/building/Building.h
    cpp/include/building/BuildingSystem.h
    cpp/include/game/Game.h
    cpp/include/game/GameState.h
    cpp/include/ui/UIRenderer.h
    cpp/include/ui/MainMenu.h
    cpp/include/utils/IsometricUtils.h
    cpp/include/utils/Logger.h
    cpp/include/utils/NoiseGenerator.h
)

# Create executable
add_executable(${PROJECT_NAME} ${ENGINE_SOURCES} ${ENGINE_HEADERS})

# Link libraries
target_link_libraries(${PROJECT_NAME}
    OpenGL::GL
    glfw
    glm::glm
)

# Copy assets to build directory
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_SOURCE_DIR}/assets $<TARGET_FILE_DIR:${PROJECT_NAME}>/assets
)

# Install target
install(TARGETS ${PROJECT_NAME} DESTINATION bin)
install(DIRECTORY assets DESTINATION bin)
