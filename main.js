import './style.css'

import {undo, redo, history} from 'prosemirror-history'
import {keymap} from 'prosemirror-keymap'
import {baseKeymap} from 'prosemirror-commands'

import {schema} from 'prosemirror-schema-basic'
import {DOMParser} from 'prosemirror-model'
import {EditorState} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'

// (The null arguments are where you can specify attributes, if necessary.)
let doc = schema.node('doc', null, [
	schema.node('paragraph', null, [schema.text('One.')]),
	schema.node('horizontal_rule'),
	schema.node('paragraph', null, [schema.text('Two!')]),
])

let content = document.getElementById('app')
let state = EditorState.create({
	doc: doc,
	// doc: DOMParser.fromSchema(schema).parse(content),
	plugins: [history(), keymap({'Mod-z': undo, 'Mod-y': redo}), keymap(baseKeymap)],
})

let view = new EditorView(document.querySelector('#app'), {
	state,
	dispatchTransaction(transaction) {
		console.log('Document size went from', transaction.before.content.size, 'to', transaction.doc.content.size)
		let newState = view.state.apply(transaction)
		view.updateState(newState)
	},
})
