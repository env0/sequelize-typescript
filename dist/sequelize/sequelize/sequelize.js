"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const model_not_initialized_error_1 = require("../../model/shared/model-not-initialized-error");
const sequelize_service_1 = require("./sequelize-service");
const model_service_1 = require("../../model/shared/model-service");
const scope_service_1 = require("../../scopes/scope-service");
const hooks_service_1 = require("../../hooks/shared/hooks-service");
const association_service_1 = require("../../associations/shared/association-service");
const attribute_service_1 = require("../../model/column/attribute-service");
const index_service_1 = require("../../model/index/index-service");
class Sequelize extends sequelize_1.Sequelize {
    constructor(...args) {
        const { preparedArgs, options } = sequelize_service_1.prepareArgs(...args);
        super(...preparedArgs);
        if (options) {
            this.repositoryMode = !!options.repositoryMode;
            if (options.models)
                this.addModels(options.models);
            if (options.modelPaths)
                this.addModels(options.modelPaths);
        }
        else {
            this.repositoryMode = false;
        }
    }
    model(model) {
        if (typeof model !== 'string') {
            return super.model(model_service_1.getModelName(model.prototype));
        }
        return super.model(model);
    }
    addModels(arg, modelMatch) {
        const defaultModelMatch = (filename, member) => filename === member;
        const models = sequelize_service_1.getModels(arg, modelMatch || this.options.modelMatch || defaultModelMatch);
        const definedModels = this.defineModels(models);
        this.associateModels(definedModels);
        scope_service_1.resolveScopes(definedModels);
        hooks_service_1.installHooks(definedModels);
    }
    getRepository(modelClass) {
        return this.model(modelClass);
    }
    associateModels(models) {
        models.forEach(model => {
            const associations = association_service_1.getAssociations(model.prototype);
            if (!associations)
                return;
            associations.forEach(association => {
                const options = association.getSequelizeOptions(model, this);
                const associatedClass = this.model(association.getAssociatedClass());
                if (!associatedClass.isInitialized) {
                    throw new model_not_initialized_error_1.ModelNotInitializedError(associatedClass, `Association between ${associatedClass.name} and ${model.name} cannot be resolved.`);
                }
                model[association.getAssociation()](associatedClass, options);
            });
        });
    }
    defineModels(models) {
        return models.map(model => {
            const modelName = model_service_1.getModelName(model.prototype);
            const attributes = attribute_service_1.getAttributes(model.prototype);
            const indexes = index_service_1.getIndexes(model.prototype);
            const modelOptions = model_service_1.getOptions(model.prototype);
            if (!modelOptions)
                throw new Error(`@Table annotation is missing on class "${model['name']}"`);
            const indexArray = Object.keys(indexes.named)
                .map(key => indexes.named[key])
                .concat(indexes.unnamed);
            const initOptions = Object.assign({}, (indexArray.length > 0 && { indexes: indexArray }), modelOptions, { modelName, sequelize: this });
            const definedModel = this.repositoryMode
                ? this.createRepositoryModel(model)
                : model;
            definedModel.init(attributes, initOptions);
            return definedModel;
        });
    }
    createRepositoryModel(modelClass) {
        return class extends modelClass {
        };
    }
}
exports.Sequelize = Sequelize;
//# sourceMappingURL=sequelize.js.map