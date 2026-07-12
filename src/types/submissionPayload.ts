export type TestCase = {
      input: string;
    output: string;
}

export type submissionPayload= {
    code: string;
    language: string;
    userId: string;
    testCases: TestCase[];
    submissionId: string;
}
