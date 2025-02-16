
//TODO: file permission? editable??

const fs = [{
    parent: null,
    name: "root",
    year: 2023,
    type: "directory",
    level: 0,
    children: [
        {
        name: "start_here.txt",
        type: "file",
        year: 2023,
        editable: false,
        parent: "root",
        content: "Type 'request' to request a challenge.\nType 'help' for a list of commands."
        },
        {
        name: "journal.txt",
        type: "file",
        year: 2023,
        editable: false,
        parent: "root",
        content: "Success! You've managed to infiltrate Commander Lambda's evil organization, and finally earned yourself an entry-level position as a Minion on their space station. From here, you just might be able to subvert Commander Lambda's plans to use the LAMBCHOP doomsday device to destroy Bunny Planet. Problem is, Minions are the lowest of the low in the Lambda hierarchy. Better buck up and get working, or you'll never make it to the top..."
        }
    ]
},
{
    name: "challenge-1",
    level: 1,
    year: 2023,
    type: "directory",
    parent: "root",
    children: [
        {
        name: "constraints.txt",
        type: "file",
        year: 2023,
        editable: false,
        parent: "challenge-1",
        content: "This is a sample text file."
        },
        {
        name: "readme.txt",
        type: "file",
        year: 2023,
        editable: false,
        parent: "challenge-1",
        content: "This is a sample text file."
        },
        {
        name: "solution.py",
        type: "file",
        year: 2023,
        editable: true,
        parent: "challenge-1",
        content: "# provide your solution here ... "
        }
    ]
    },
    {
        name: "challenge-2",
        level: 2,
        year: 2023,
        type: "directory",
        parent: "root",
        children: [
            {
            name: "constraints.txt",
            type: "file",
            year: 2023,
            editable: false,
            parent: "challenge-2",
            content: "This is a sample text file."
            },
            {
            name: "readme.txt",
            type: "file",
            year: 2023,
            editable: false,
            parent: "challenge-2",
            content: "This is a sample text file."
            },
            {
            name: "solution.py",
            type: "file",
            year: 2023,
            editable: true,
            parent: "challenge-2",
            content: "# provide your solution here ... "
            }
        ]
    },
    {
        name: "challenge-3",
        level: 3,
        year: 2023,
        type: "directory",
        parent: "root",
        children: [
            {
            name: "constraints.txt",
            type: "file",
            year: 2023,
            editable: false,
            parent: "challenge-3",
            content: "This is a sample text file."
            },
            {
            name: "readme.txt",
            type: "file",
            year: 2023,
            editable: false,
            parent: "challenge-3",
            content: "This is a sample text file."
            },
            {
            name: "solution.py",
            type: "file",
            year: 2023,
            editable: true,
            parent: "challenge-3",
            content: "# provide your solution here ... "
            }
        ]
    },
    {
        name: "challenge-4",
        level: 4,
        year: 2023,
        type: "directory",
        parent: "root",
        children: [
            {
            name: "constraints.txt",
            type: "file",
            year: 2023,
            editable: false,
            parent: "challenge-4",
            content: "This is a sample text file."
            },
            {
            name: "readme.txt",
            type: "file",
            year: 2023,
            editable: false,
            parent: "challenge-4",
            content: "This is a sample text file."
            },
            {
            name: "solution.py",
            type: "file",
            year: 2023,
            editable: true,
            parent: "challenge-4",
            content: "# provide your solution here ... "
            }
        ]
    }]



class Node {
  constructor(name, isFolder, content, children, parent, editable) {
    this.name = name
    this.isFolder = isFolder
    this.children = children
    this.parent = parent
    this.content = content
    this.editable = editable
  }
}

export const absRoot = new Node()

export const createFS = (fs, parent) => {
    if(parent === null) {
        absRoot.name = fs.name
        absRoot.isFolder = fs.type === "directory"
        absRoot.parent = parent
        absRoot.editable = fs.editable
        absRoot.content = fs.content
        absRoot.children = fs.children?.map(c => createFS(c, absRoot))
        // absRoot.children = fs.children?.filter(c => c.level < 1)
        //                                 .map(c => createFS(c, absRoot))
        return absRoot
    }
    // REVIEW: in childen, there a null file object caused by request 5th challange
    if(fs) {
        const root = new Node()
        root.name = fs.name
        root.isFolder = fs.type === "directory"
        root.parent = parent
        root.editable = fs.editable
        root.content = fs.content
        root.children = fs.children?.map(c => createFS(c, root))
        return root
    }
}

// export let root = createFS(fs, null)

