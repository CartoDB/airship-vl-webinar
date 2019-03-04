import { ColorMap } from '../types/ColorMap';
import { Metadata } from '../types/Metadata';
/**
 * Creates a mapping from a list of keys to a list of colors.
 * @param keys
 * @param metadata
 */
export declare function create(keys: string[], metadata: Metadata): ColorMap;
declare const _default: {
    create: typeof create;
};
export default _default;
