import test from 'tape'
import { Map } from 'immutable'

import SpanList from './SpanList'
import Span from './Span'
import Format from './Format'
import Block from './Block'
import BlockList from './BlockList'
import Selection from './Selection'
import EditorState from './EditorState'

/*
{
    selection: {
        target: null,
        startIndex: 1,
        endIndex: 1,
        startOffset: 0,
        endOffset: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
    },
    blocks: [
        {
            text: 'Lorem ipsum dolor sit amet,',
            spans: [
                { start: 0, end: 12, formats: {} },
                { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
            ],
        },
        {
            text: ' consectetur adipiscing elit.',
            spans: [
                { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                { start: 13, end: 29, formats: {} },
            ],
        },
        {
            text: 'Aliquam accumsan cursus sem quis placerat.',
            spans: [
                { start: 0, end: 30, formats: {} },
                { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                { start: 38, end: 42, formats: {} },
            ],
        },
    ],
},
 */

const getFixtures = () =>
  BlockList.create([
    Block.create({
      text: 'Lorem ipsum dolor sit amet,',
      spans: SpanList.create([
        Span.create({
          start: 0,
          end: 12
        }),
        Span.create({
          start: 12,
          end: 27,
          formats: Map({
            i: Format.create({
              name: 'i'
            })
          })
        })
      ])
    }),
    Block.create({
      text: ' consectetur adipiscing elit.',
      spans: SpanList.create([
        Span.create({
          start: 0,
          end: 13,
          formats: Map({
            i: Format.create({
              name: 'i'
            })
          })
        }),
        Span.create({
          start: 13,
          end: 29
        })
      ])
    }),
    Block.create({
      text:
        'Aliquam accumsan cursus sem quis placerat.',
      spans: SpanList.create([
        Span.create({
          start: 0,
          end: 30
        }),
        Span.create({
          start: 30,
          end: 38,
          formats: Map({
            i: Format.create({
              name: 'i'
            })
          })
        }),
        Span.create({
          start: 38,
          end: 42
        })
      ])
    })
  ])

test('EditorState.create', assert => {
  assert.plan(2)

  assert.throws(
    () => EditorState.create(Selection.create()),
    Error
  )

  assert.throws(
    () => EditorState.create(null, getFixtures()),
    Error
  )
})

test('EditorState.getSelection', assert => {
  assert.plan(1)

  const selection = Selection.create()
  const fixtures = getFixtures()
  const editorState = EditorState.create(
    selection,
    fixtures
  )

  assert.equal(
    EditorState.getSelection(editorState) ===
      selection,
    true
  )
})

test('EditorState.getBlockList', assert => {
  assert.plan(1)

  const selection = Selection.create()
  const fixtures = getFixtures()
  const editorState = EditorState.create(
    selection,
    fixtures
  )

  assert.equal(
    EditorState.getBlockList(editorState) ===
      fixtures,
    true
  )
})

test('EditorState.removeSelection', assert => {
  assert.plan(1)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.removeSelection(
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 1,
          startOffset: 6,
          endOffset: 17
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 0,
        startOffset: 6,
        endOffset: 6,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem iscing elit.',
          spans: [
            { start: 0, end: 18, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )
})

test('EditorState.insertOrSplitBlockAfterSelection', assert => {
  assert.plan(2)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.insertOrSplitBlockAfterSelection(
      EditorState.create(
        Selection.create(),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 1,
        endIndex: 1,
        startOffset: 0,
        endOffset: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: '',
          spans: [
            { start: 0, end: 0, formats: {} }
          ]
        },
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 27,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )

  assert.deepEqual(
    EditorState.insertOrSplitBlockAfterSelection(
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 0,
          startOffset: 27,
          endOffset: 27
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 1,
        endIndex: 1,
        startOffset: 0,
        endOffset: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 27,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: '',
          spans: [
            { start: 0, end: 0, formats: {} }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )
})

test('EditorState.insertTextAfterSelection', assert => {
  assert.plan(2)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.insertTextAfterSelection(
      'FOO',
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 0,
          startOffset: 27,
          endOffset: 27
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 0,
        startOffset: 30,
        endOffset: 30,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum dolor sit amet,FOO',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 30,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )
  assert.deepEqual(
    EditorState.insertTextAfterSelection(
      'FOO',
      EditorState.create(
        Selection.create({
          startIndex: 1,
          endIndex: 1,
          startOffset: 13,
          endOffset: 13
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 1,
        endIndex: 1,
        startOffset: 16,
        endOffset: 16,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 27,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text:
            ' consectetur FOOadipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 32, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )
})

test('EditorState.removeCharBeforeSelection', assert => {
  assert.plan(3)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.removeCharBeforeSelection(
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 0,
          startOffset: 12,
          endOffset: 12
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 0,
        startOffset: 11,
        endOffset: 11,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsumdolor sit amet,',
          spans: [
            { start: 0, end: 11, formats: {} },
            {
              start: 11,
              end: 26,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )

  assert.deepEqual(
    EditorState.removeCharBeforeSelection(
      EditorState.create(
        Selection.create({
          startIndex: 1,
          endIndex: 1,
          startOffset: 0,
          endOffset: 0
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 0,
        startOffset: 27,
        endOffset: 27,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 40,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 40, end: 56, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )

  assert.equal(
    EditorState.getBlockList(
      EditorState.removeCharBeforeSelection(
        EditorState.create(
          Selection.create({
            startIndex: 0,
            endIndex: 0,
            startOffset: 0,
            endOffset: 0
          }),
          fixtures
        )
      )
    ),
    fixtures
  )
})

test('EditorState.removeCharAfterSelection', assert => {
  assert.plan(3)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.removeCharAfterSelection(
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 0,
          startOffset: 12,
          endOffset: 12
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 0,
        startOffset: 12,
        endOffset: 12,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum olor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 26,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )

  assert.deepEqual(
    EditorState.removeCharAfterSelection(
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 0,
          startOffset: 27,
          endOffset: 27
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 0,
        startOffset: 27,
        endOffset: 27,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 40,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 40, end: 56, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )

  assert.equal(
    EditorState.getBlockList(
      EditorState.removeCharAfterSelection(
        EditorState.create(
          Selection.create({
            startIndex: 2,
            endIndex: 2,
            startOffset: 42,
            endOffset: 42
          }),
          fixtures
        )
      )
    ),
    fixtures
  )
})

test('EditorState.append', assert => {
  assert.plan(2)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.append(
      false,
      EditorState.create(
        Selection.create(),
        fixtures
      ),
      EditorState.create(
        Selection.create(),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 2,
        endIndex: 2,
        startOffset: 42,
        endOffset: 42,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 27,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        },
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 27,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )

  assert.deepEqual(
    EditorState.append(
      true,
      EditorState.create(
        Selection.create(),
        fixtures
      ),
      EditorState.create(
        Selection.create(),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 2,
        endIndex: 2,
        startOffset: 42,
        endOffset: 42,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 27,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 54, formats: {} },
            {
              start: 54,
              end: 69,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )
})

test('EditorState.prepend', assert => {
  assert.plan(1)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.append(
      true,
      EditorState.create(
        Selection.create(),
        fixtures
      ),
      EditorState.create(
        Selection.create(),
        fixtures
      )
    ).toJS(),
    EditorState.prepend(
      true,
      EditorState.create(
        Selection.create(),
        fixtures
      ),
      EditorState.create(
        Selection.create(),
        fixtures
      )
    ).toJS()
  )
})

test('EditorState.copySelection', assert => {
  assert.plan(1)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.copySelection(
      EditorState.create(
        Selection.create({
          startIndex: 1,
          endIndex: 2,
          startOffset: 13,
          endOffset: 32
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 0,
        startOffset: 0,
        endOffset: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'adipiscing elit.',
          spans: [
            { start: 0, end: 16, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 32,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        }
      ]
    }
  )
})

test('EditorState.pasteAfterSelection', assert => {
  assert.plan(2)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.pasteAfterSelection(
      EditorState.copySelection(
        EditorState.create(
          Selection.create({
            startIndex: 1,
            endIndex: 2,
            startOffset: 13,
            endOffset: 32
          }),
          fixtures
        )
      ),
      EditorState.create(
        Selection.create(),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 1,
        endIndex: 1,
        startOffset: 32,
        endOffset: 32,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'adipiscing elit.',
          spans: [
            { start: 0, end: 16, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quisLorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 32,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 32, end: 44, formats: {} },
            {
              start: 44,
              end: 59,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )

  assert.deepEqual(
    EditorState.pasteAfterSelection(
      EditorState.copySelection(
        EditorState.create(
          Selection.create({
            startIndex: 1,
            endIndex: 2,
            startOffset: 13,
            endOffset: 32
          }),
          fixtures
        )
      ),
      EditorState.create(
        Selection.create({
          startIndex: 1,
          endIndex: 1,
          startOffset: 17,
          endOffset: 17
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 2,
        endIndex: 2,
        startOffset: 32,
        endOffset: 32,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 27,
              formats: {
                i: { name: 'i', data: {} }
              }
            }
          ]
        },
        {
          text:
            ' consectetur adipadipiscing elit.',
          spans: [
            {
              start: 0,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 33, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quisiscing elit.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 32,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 32, end: 44, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )
})

test('EditorState.addFormatToSelection', assert => {
  assert.plan(1)

  const format = Format.create({ name: 'b' })
  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.addFormatToSelection(
      format,
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 1,
          startOffset: 15,
          endOffset: 6
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 1,
        startOffset: 15,
        endOffset: 6,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 12, formats: {} },
            {
              start: 12,
              end: 15,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            {
              start: 15,
              end: 27,
              formats: {
                i: { name: 'i', data: {} },
                b: { name: 'b', data: {} }
              }
            }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            {
              start: 0,
              end: 6,
              formats: {
                i: { name: 'i', data: {} },
                b: { name: 'b', data: {} }
              }
            },
            {
              start: 6,
              end: 13,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 13, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )
})

test('EditorState.removeFormatFromSelection', assert => {
  assert.plan(1)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.removeFormatFromSelection(
      'i',
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 1,
          startOffset: 15,
          endOffset: 6
        }),
        fixtures
      )
    ).toJS(),
    {
      selection: {
        target: null,
        startIndex: 0,
        endIndex: 1,
        startOffset: 15,
        endOffset: 6,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      blocks: [
        {
          text: 'Lorem ipsum dolor sit amet,',
          spans: [
            { start: 0, end: 27, formats: {} }
          ]
        },
        {
          text: ' consectetur adipiscing elit.',
          spans: [
            { start: 0, end: 29, formats: {} }
          ]
        },
        {
          text:
            'Aliquam accumsan cursus sem quis placerat.',
          spans: [
            { start: 0, end: 30, formats: {} },
            {
              start: 30,
              end: 38,
              formats: {
                i: { name: 'i', data: {} }
              }
            },
            { start: 38, end: 42, formats: {} }
          ]
        }
      ]
    }
  )
})

test('EditorState.getFormatNamesInSelection', assert => {
  assert.plan(1)

  const fixtures = getFixtures()

  assert.deepEqual(
    EditorState.getFormatNamesInSelection(
      EditorState.create(
        Selection.create({
          startIndex: 0,
          endIndex: 1,
          startOffset: 15,
          endOffset: 6
        }),
        fixtures
      )
    ).toJS(),
    ['i']
  )
})
