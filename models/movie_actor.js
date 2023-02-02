"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class movie_actor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  movie_actor.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Movie,
          key: "id",
        },
      },
      actor_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Actor,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "movie_actor",
    }
  );
  return movie_actor;
};
