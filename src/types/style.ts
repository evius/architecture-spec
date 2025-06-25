export interface StyleGuide {
  name: string;
  language: string;
  description: string;

  rules: {
    naming?: {
      files?: string;
      classes?: string;
      interfaces?: string;
      types?: string;
      functions?: string;
      constants?: string;
      privateMembers?: string;
    };

    types?: {
      explicitReturnTypes?: string;
      implicitAny?: string;
      any?: string;
      assertions?: string;
      nonNullAssertion?: string;
    };

    imports?: {
      order?: string[];
      grouping?: string;
      typeImports?: string;
    };

    functions?: {
      arrowFunctions?: string;
      regularFunctions?: string;
      asyncAwait?: string;
      parameters?: string;
    };

    classes?: {
      memberOrdering?: string[];
      accessModifiers?: string;
      readonlyModifier?: string;
    };

    errorHandling?: {
      customErrors?: string;
      errorTypes?: string;
      tryReturns?: string;
    };

    documentation?: {
      jsDoc?: string;
      inlineComments?: string;
      todoComments?: string;
    };
  };

  codeExamples?: {
    [key: string]: string;
  };

  linterConfig?: {
    extends?: string[];
    plugins?: string[];
    rules?: Record<string, unknown>;
  };
}
