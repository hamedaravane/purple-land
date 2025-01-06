#!/bin/bash

# Define the base directory
BASE_DIR="./"

# Define the directory structure as an array
dirs=(
  "$BASE_DIR/domain/bubbles/aggregates"
  "$BASE_DIR/domain/bubbles/entities"
  "$BASE_DIR/domain/bubbles/services"
  "$BASE_DIR/domain/bubbles/events"
  "$BASE_DIR/domain/bubbles/repositories"
  "$BASE_DIR/domain/shooting/entities"
  "$BASE_DIR/domain/shooting/services"
  "$BASE_DIR/domain/shooting/events"
  "$BASE_DIR/domain/shooting/repositories"
  "$BASE_DIR/domain/scoring/aggregates"
  "$BASE_DIR/domain/scoring/services"
  "$BASE_DIR/domain/scoring/events"
  "$BASE_DIR/domain/scoring/repositories"
  "$BASE_DIR/domain/level/aggregates"
  "$BASE_DIR/domain/level/services"
  "$BASE_DIR/domain/level/events"
  "$BASE_DIR/domain/level/repositories"
  "$BASE_DIR/domain/player/aggregates"
  "$BASE_DIR/domain/player/services"
  "$BASE_DIR/domain/player/events"
  "$BASE_DIR/domain/player/repositories"
  "$BASE_DIR/application/usecases"
  "$BASE_DIR/application/services"
  "$BASE_DIR/infrastructure/phaser/scenes"
  "$BASE_DIR/infrastructure/phaser/systems"
  "$BASE_DIR/infrastructure/persistence"
  "$BASE_DIR/infrastructure/network"
  "$BASE_DIR/shared/types"
  "$BASE_DIR/shared/utils"
  "$BASE_DIR/shared/constants"
)

# Define the initial files to create
files=(
  "$BASE_DIR/main.ts"
  "$BASE_DIR/application/usecases/ShootBubbleUseCase.ts"
  "$BASE_DIR/application/usecases/UpdateGameStateUseCase.ts"
  "$BASE_DIR/application/services/DomainEventPublisher.ts"
  "$BASE_DIR/infrastructure/phaser/scenes/MainScene.ts"
  "$BASE_DIR/infrastructure/phaser/scenes/BootScene.ts"
  "$BASE_DIR/infrastructure/phaser/scenes/UIScene.ts"
  "$BASE_DIR/infrastructure/phaser/systems/InputSystem.ts"
  "$BASE_DIR/shared/types/index.d.ts"
  "$BASE_DIR/shared/utils/MathUtils.ts"
  "$BASE_DIR/shared/constants/GameConstants.ts"
)

# Create the directories
for dir in "${dirs[@]}"; do
  echo "Creating directory: $dir"
  mkdir -p "$dir"
done

# Create the files
for file in "${files[@]}"; do
  echo "Creating file: $file"
  touch "$file"
done

echo "Project structure created successfully."
