import { Weather, WeatherType } from "#app/data/weather";
import { Abilities } from "#app/enums/abilities.js";
import { Biome } from "#app/enums/biome";
import { Moves } from "#app/enums/moves.js";
import { Species } from "#app/enums/species.js";
import * as GameMode from "#app/game-mode";
import { GameModes, getGameMode } from "#app/game-mode";
import Overrides from "#app/overrides";
import GameManager from "#test/utils/gameManager";
import { vi } from "vitest";

/**
 * Helper to handle overrides in tests
 */
export class OverridesHelper {
  private readonly game: GameManager;

  constructor(game: GameManager) {
    this.game = game;
  }

  /**
   * Override the starting biome
   * @warning Any event listeners that are attached to [NewArenaEvent](events\battle-scene.ts) may need to be handled down the line
   * @param biome the biome to set
   */
  startingBiome(biome: Biome): this {
    this.game.scene.newArena(biome);
    this.log(`Starting biome set to ${Biome[biome]} (=${biome})!`);
    return this;
  }

  /**
   * Override the starting wave (index)
   * @param wave the wave (index) to set. Classic: `1`-`200`
   * @returns this
   */
  startingWave(wave: number): this {
    vi.spyOn(Overrides, "STARTING_WAVE_OVERRIDE", "get").mockReturnValue(wave);
    this.log(`Starting wave set to ${wave}!`);
    return this;
  }

  /**
   * Override the player (pokemon) starting level
   * @param level the (pokemon) level to set
   * @returns this
   */
  startingLevel(level: Species | number): this {
    vi.spyOn(Overrides, "STARTING_LEVEL_OVERRIDE", "get").mockReturnValue(level);
    this.log(`Player Pokemon starting level set to ${level}!`);
    return this;
  }

  /**
   * Override the player (pokemon) {@linkcode Species | species}
   * @param species the (pokemon) {@linkcode Species | species} to set
   * @returns this
   */
  starterSpecies(species: Species | number): this {
    vi.spyOn(Overrides, "STARTER_SPECIES_OVERRIDE", "get").mockReturnValue(species);
    this.log(`Player Pokemon species set to ${Species[species]} (=${species})!`);
    return this;
  }

  /**
   * Override the player (pokemon) {@linkcode Abilities | ability}
   * @param ability the (pokemon) {@linkcode Abilities | ability} to set
   * @returns this
   */
  ability(ability: Abilities): this {
    vi.spyOn(Overrides, "ABILITY_OVERRIDE", "get").mockReturnValue(ability);
    this.log(`Player Pokemon ability set to ${Abilities[ability]} (=${ability})!`);
    return this;
  }

  /**
   * Override each wave to have or not have standard trainer battles
   * @returns this
   * @param disable true
   */
  disableTrainerWaves(disable: boolean): this {
    const realFn = getGameMode;
    vi.spyOn(GameMode, "getGameMode").mockImplementation((gameMode: GameModes) => {
      const mode = realFn(gameMode);
      mode.hasTrainers = !disable;
      return mode;
    });
    this.log(`Standard trainer waves are ${disable ? "disabled" : "enabled"}!`);
    return this;
  }

  /**
   * Override the {@linkcode WeatherType | weather (type)}
   * @param type {@linkcode WeatherType | weather type} to set
   * @returns this
   */
  weather(type: WeatherType): this {
    vi.spyOn(Overrides, "WEATHER_OVERRIDE", "get").mockReturnValue(type);
    this.log(`Weather set to ${Weather[type]} (=${type})!`);
    return this;
  }

  /**
   * Override the seed
   * @param seed the seed to set
   * @returns this
   */
  seed(seed: string): this {
    vi.spyOn(this.game.scene, "resetSeed").mockImplementation(() => {
      this.game.scene.waveSeed = seed;
      Phaser.Math.RND.sow([seed]);
      this.game.scene.rngCounter = 0;
    });
    this.game.scene.resetSeed();
    this.log(`Seed set to "${seed}"!`);
    return this;
  }

  /**
   * Override the battle type (single or double)
   * @param battleType battle type to set
   * @returns this
   */
  battleType(battleType: "single" | "double"): this {
    vi.spyOn(Overrides, "BATTLE_TYPE_OVERRIDE", "get").mockReturnValue(battleType);
    this.log(`Battle type set to ${battleType} only!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) {@linkcode Species | species}
   * @param species the (pokemon) {@linkcode Species | species} to set
   * @returns this
   */
  enemySpecies(species: Species | number): this {
    vi.spyOn(Overrides, "OPP_SPECIES_OVERRIDE", "get").mockReturnValue(species);
    this.log(`Enemy Pokemon species set to ${Species[species]} (=${species})!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) {@linkcode Abilities | ability}
   * @param ability the (pokemon) {@linkcode Abilities | ability} to set
   * @returns this
   */
  enemyAbility(ability: Abilities): this {
    vi.spyOn(Overrides, "OPP_ABILITY_OVERRIDE", "get").mockReturnValue(ability);
    this.log(`Enemy Pokemon ability set to ${Abilities[ability]} (=${ability})!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) {@linkcode Moves | moves}set
   * @param moveset the {@linkcode Moves | moves}set to set
   * @returns this
   */
  enemyMoveset(moveset: Moves[]): this {
    vi.spyOn(Overrides, "OPP_MOVESET_OVERRIDE", "get").mockReturnValue(moveset);
    const movesetStr = moveset.map((moveId) => Moves[moveId]).join(", ");
    this.log(`Enemy Pokemon moveset set to ${movesetStr} (=[${moveset.join(", ")}])!`);
    return this;
  }

  private log(...params: any[]) {
    console.log("Overrides:", ...params);
  }
}
