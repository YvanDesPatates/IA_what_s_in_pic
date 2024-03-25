package decompress

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"huffio/pkg/common"

	// "math/big"
	"os"
)

// Decompress is a function that decompresses the input file using the Huffman Tree
func Decompress(inFile string, outFile string) error {
	tree, compressedData, err := readCompressedFile(inFile)
	if err != nil {
		return err
	}
	common.DisplayTree(tree) // Affiche l'arbre Huffman pour vérification

	decompressedData, err := decompressData(compressedData, tree)
	if err != nil {
		return err
	}

	return os.WriteFile(outFile, decompressedData, 0644)
}

// readCompressedFile is a function that reads the compressed file, and extracts the Huffman Tree and the compressed data
// func readCompressedFile(inFile string) (*common.Tree, []byte, error) {
// 	fileData, err := os.ReadFile(inFile)
// 	if err != nil {
// 		return nil, nil, err
// 	}

// 	fmt.Printf("Raw file data: %x\n", fileData) // Affiche les données brutes du fichier

// 	// Deserialize the Huffman Tree
// 	tree := &common.Tree{}
// 	treeBuffer := bytes.NewBuffer(fileData)
// 	treeDecoder := gob.NewDecoder(treeBuffer)
// 	err = treeDecoder.Decode(tree)
// 	if err != nil {
// 		return nil, nil, err
// 	}

// 	fmt.Printf("After tree deserialization, remaining buffer size: %d\n", treeBuffer.Len()) // Taille du buffer après désérialisation

// 	compressedData := fileData[treeBuffer.Len():]       // Extrait les données compressées
// 	fmt.Printf("Compressed data: %x\n", compressedData) // Affiche les données compressées

//		return tree, compressedData, nil
//	}
func readCompressedFile(inFile string) (*common.Tree, []byte, error) {
	fileData, err := os.ReadFile(inFile)
	if err != nil {
		return nil, nil, err
	}

	fmt.Printf("Raw file data: %x\n", fileData)

	// Utiliser bytes.Reader pour la désérialisation
	tree := &common.Tree{}
	treeReader := bytes.NewReader(fileData) // Crée un bytes.Reader au lieu d'un Buffer
	treeDecoder := gob.NewDecoder(treeReader)
	err = treeDecoder.Decode(tree)
	if err != nil {
		return nil, nil, err
	}

	// Utiliser la position actuelle dans treeReader pour déterminer où commencent les données compressées
	pos, err := treeReader.Seek(0, os.SEEK_CUR) // Obtient la position actuelle
	if err != nil {
		return nil, nil, err
	}

	fmt.Printf("After tree deserialization, remaining buffer size: %d\n", treeReader.Len())

	compressedData := fileData[pos:] // Extrait les données compressées à partir de la position actuelle
	return tree, compressedData, nil
}

// decompressData is a function that decompresses the compressed data using the Huffman Tree
// decompressData is a function that decompresses the compressed data using the Huffman Tree
func decompressData(compressedData []byte, tree *common.Tree) ([]byte, error) {
	var decompressed bytes.Buffer
	currentNode := tree.Root

	for i, b := range compressedData {

		fmt.Printf("Processing byte %d: %08b - %x\n", i, b, b) // Affiche le byte en binaire

		for bitPos := 7; bitPos >= 0; bitPos-- {
			bit := b >> bitPos & 1
			fmt.Printf("Bit: %d - %x\n", bit, bit) // Affiche le bit

			if bit == 0 {
				currentNode = currentNode.Left
			} else {
				currentNode = currentNode.Right
			}

			if currentNode.Left == nil && currentNode.Right == nil {
				fmt.Printf("Leaf node found, character: %c\n", currentNode.Character) // Affiche le caractère de la feuille trouvée
				decompressed.WriteByte(byte(currentNode.Character))
				currentNode = tree.Root // Retour à la racine pour le prochain bit
			}
		}
	}
	return decompressed.Bytes(), nil
}

/*
010000 -> H
001000 -> E

010000 001000
*/
