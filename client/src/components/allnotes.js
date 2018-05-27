<h1>All Notes</h1>
        {this.state.notes.map(note =>
            <div key={note.id}>{note.name} - {unescape(note.message)}</div>
        )}