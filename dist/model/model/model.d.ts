import { InitOptions, Model as OriginModel, ModelAttributes, FindOptions, BuildOptions, Promise } from 'sequelize';
import { AssociationGetOptions } from "./association/association-get-options";
import { AssociationCountOptions } from "./association/association-count-options";
import { AssociationActionOptions } from "./association/association-action-options";
import { AssociationCreateOptions } from "./association/association-create-options";
export declare type ModelType = typeof Model;
export declare type ModelCtor<M extends Model = Model> = (new () => M) & ModelType;
export declare type $GetType<T> = NonNullable<T> extends any[] ? NonNullable<T> : (NonNullable<T> | null);
export declare abstract class Model<T = any, T2 = any> extends OriginModel<T, T2> {
    id?: number | any;
    createdAt?: Date | any;
    updatedAt?: Date | any;
    deletedAt?: Date | any;
    version?: number | any;
    static isInitialized: boolean;
    static init(attributes: ModelAttributes, options: InitOptions): void;
    constructor(values?: object, options?: BuildOptions);
    /**
     * Adds relation between specified instances and source instance
     */
    $add<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: AssociationActionOptions): Promise<unknown>;
    /**
     * Sets relation between specified instances and source instance
     * (replaces old relations)
     */
    $set<R extends Model<R>>(propertyKey: keyof this, instances: R | R[] | string[] | string | number[] | number, options?: AssociationActionOptions): Promise<unknown>;
    /**
     * Returns related instance (specified by propertyKey) of source instance
     */
    $get<K extends keyof this>(propertyKey: K, options?: AssociationGetOptions): Promise<$GetType<this[K]>>;
    /**
     * Counts related instances (specified by propertyKey) of source instance
     */
    $count<R extends Model<R>>(propertyKey: string, options?: AssociationCountOptions): Promise<number>;
    /**
     * Creates instances and relate them to source instance
     */
    $create<R extends Model<R>>(propertyKey: string, values: any, options?: AssociationCreateOptions): Promise<R>;
    /**
     * Checks if specified instances is related to source instance
     */
    $has<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: AssociationGetOptions): Promise<boolean>;
    /**
     * Removes specified instances from source instance
     */
    $remove<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: any): Promise<any>;
    reload(options?: FindOptions): Promise<this>;
}
/**
 * Indicates which static methods of Model has to be proxied,
 * to prepare include option to automatically resolve alias;
 * The index represents the index of the options of the
 * corresponding method parameter
 */
export declare const INFER_ALIAS_MAP: {
    bulkBuild: number;
    build: number;
    create: number;
    aggregate: number;
    all: number;
    find: number;
    findAll: number;
    findAndCount: number;
    findAndCountAll: number;
    findById: number;
    findByPrimary: number;
    findCreateFind: number;
    findOne: number;
    findOrBuild: number;
    findOrCreate: number;
    findOrInitialize: number;
    reload: number;
};
