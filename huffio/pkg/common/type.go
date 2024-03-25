package common

// This package is used to store common code that is used in multiple packages.
// - Struct for the Tree and Node of the Huffman Tree
// - Function to build the Huffman Tree

// Node is a struct that represents a node in the Huffman Tree (each character in the input file is a Node)
type Node struct {
	Character byte
	Freq      int
	Left      *Node
	Right     *Node
}

// Tree is a struct that represents the Huffman Tree
type Tree struct {
	Root *Node
}
