import { equals } from 'ramda';

export const arePropsEqual = (prevProps: any, nextProps: any) => equals(prevProps, nextProps);
