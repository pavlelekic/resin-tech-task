import parseTree from './parse-tree';


describe('parseTree() function', () => {
    it('builds correct tree from initial input', () => {
        const testInput = "\
page 1\n\
  page 1.1\n\
  page 1.2\n\
    page 1.2.1\n\
page 2\n\
page 3\n\
  page 3.1\n\
  page 3.2\n\
page 4\n\
  page 4.1\n\
    page 4.1.1\n\
      page 4.1.1.1\n\
  page 4.2\n\
page 5\
";

        const expectedOutput = {
            "title":null,
            "isRoot":true,
            "children":[
                {
                    "title":"page 1",
                    "isRoot":false,
                    "children":[
                        {
                            "title":"page 1.1",
                            "isRoot":false,
                            "children":[]
                        },
                        {
                            "title":"page 1.2",
                            "isRoot":false,
                            "children":[
                                {
                                    "title":"page 1.2.1",
                                    "isRoot":false,
                                    "children":[]
                                }
                            ]
                        }
                    ]
                },
                {
                    "title":"page 2",
                    "isRoot":false,
                    "children":[]
                },
                {
                    "title":"page 3",
                    "isRoot":false,
                    "children":[
                        {
                            "title":"page 3.1",
                            "isRoot":false,
                            "children":[]
                        },
                        {
                            "title":"page 3.2",
                            "isRoot":false,
                            "children":[]
                        }
                    ]
                },
                {
                    "title":"page 4",
                    "isRoot":false,
                    "children":[
                        {
                            "title":"page 4.1",
                            "isRoot":false,
                            "children":[
                                {
                                    "title":"page 4.1.1",
                                    "isRoot":false,
                                    "children":[
                                        {
                                            "title":"page 4.1.1.1",
                                            "isRoot":false,
                                            "children":[]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "title":"page 4.2",
                            "isRoot":false,
                            "children":[]
                        }
                    ]
                },
                {
                    "title":"page 5",
                    "isRoot":false,
                    "children":[]
                }
            ]
        };

        const tree = parseTree(testInput);

        expect(tree).toEqual(expectedOutput);
    });


    it('throws exception when indentation is too big', () => {
        expect(parseTree.bind(null, "page 1\n             page 1.1")).toThrowError(SyntaxError);
    });

    it('throws exception when there are empty lines', () => {
        expect(parseTree.bind(null, "\n\n\n")).toThrowError(SyntaxError);
    });

    it('throws exception when non string input is provided', () => {
        expect(parseTree.bind(null, 123)).toThrowError(TypeError);
    });

    it('throws exception when indentation is not a multiple of 2', () => {
        expect(parseTree.bind(null, "page 1\n   page 1.1")).toThrowError(SyntaxError);
    });
});
