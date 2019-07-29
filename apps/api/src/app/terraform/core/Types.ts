type SimpleOutput = string;

type Output = {
  sensitive: boolean;
  type: string;
  value: string;
};

interface SimpleOutputObject {
  [k: string]: SimpleOutput;
}

interface OutputObject {
  [k: string]: Output;
}

type TerraformSingleOutput = Output;

type TerraformMultipleOutput = {
  [k: string]: Output;
};
type ResourceCounts = {
  addCount: number;
  changeCount: number;
  destroyCount: number;
};

enum ChangeTypes {
  PLAN,
  ADDED,
  DESTROYED
}

export {
  ChangeTypes,
  ResourceCounts,
  TerraformMultipleOutput,
  TerraformSingleOutput,
  OutputObject,
  SimpleOutputObject,
  SimpleOutput,
  Output
};
