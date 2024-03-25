package common

import (
	"container/heap"
	"fmt"
)

// BuildTree is a function that builds the Huffman Tree from the input file, with frequency of each character
func BuildTree(frequencies map[rune]int) *Tree {
	var h Heap
	heap.Init(&h)

	for c, f := range frequencies {
		heap.Push(&h, &Node{Character: c, Freq: f})
	}

	for h.Len() > 1 {
		// Extract the two nodes with the lowest frequencies
		left := heap.Pop(&h).(*Node)
		right := heap.Pop(&h).(*Node)

		// Create a new node with the two extracted nodes as children
		merged := &Node{
			Freq:  left.Freq + right.Freq,
			Left:  left,
			Right: right,
		}
		heap.Push(&h, merged)
	}

	return &Tree{Root: heap.Pop(&h).(*Node)}
}

// GenerateCodes is a function that generates the Huffman codes for each character in the input file
func GenerateCodes(tree *Tree) map[rune]string {
	codes := make(map[rune]string)
	var generate func(node *Node, code string)

	generate = func(node *Node, code string) {
		if node == nil {
			return
		}

		if node.Left == nil && node.Right == nil {
			codes[node.Character] = code
			return
		}

		// generate(node.Left, append(code, 0))
		// generate(node.Left, append(code, 1))
		generate(node.Left, code+"0")
		generate(node.Right, code+"1")
	}
	generate(tree.Root, "")
	return codes
}

// displayNode is a function that displays a node in the Huffman Tree
func displayNode(node *Node, prefix string, nodePrefix string) {
	if node == nil {
		return
	}

	charDisplay := fmt.Sprintf("%q", node.Character)
	if node.Character == '\n' {
		charDisplay = "'\\n'"
	} else if node.Character == ' ' {
		charDisplay = "' '"
	} else if node.Character == 0 {
		charDisplay = "EOF" // Pour les nœuds internes sans caractère associé
	}

	// Affiche le noeud courant
	fmt.Printf("%s%s%s : %d\n", prefix, nodePrefix, charDisplay, node.Freq)

	// Prépare les préfixes pour les appels récursifs
	newPrefix := prefix + "│   "
	if nodePrefix == "└── " {
		newPrefix = prefix + "    "
	}

	// Gestion des appels récursifs pour les enfants
	if node.Left != nil || node.Right != nil {
		if node.Right != nil {
			displayNode(node.Right, newPrefix, "├── ")
		}
		if node.Left != nil {
			displayNode(node.Left, newPrefix, "└── ")
		}
	}
}

// DisplayTree is a function that displays the Huffman Tree
func DisplayTree(tree *Tree) {
	fmt.Println("Huffman Tree:")
	displayNode(tree.Root, "", "Root: ")
}

// SerializeTree is a function that serializes the Huffman Tree to save it
func SerializeTree(tree *Tree) []byte {
	return nil
}

// DeserializeTree is a function that deserializes the Huffman Tree to read it
func DeserializeTree(data []byte) *Tree {
	return nil
}
