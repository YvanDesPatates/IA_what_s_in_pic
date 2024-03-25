package compress

import (
	"bufio"
	"bytes"
	"encoding/gob"
	"fmt"
	"huffio/pkg/common"
	"io"
	"os"
)

// Compress is a function that compresses the input file using Huffman coding, and writes the compressed file to the output file
func Compress(inFile string, outFile string) error {
	// Open the input file
	file, err := os.Open(inFile)
	if err != nil {
		return err
	}
	defer file.Close()

	// Calculate the frequency of each character in the input file
	frequencies, err := calculateFrequencies(file)
	if err != nil {
		return err
	}

	// Build the Huffman Tree from the frequency of each character
	tree := common.BuildTree(frequencies)
	codes := common.GenerateCodes(tree)
	// common.DisplayTree(tree)

	file.Seek(0, 0)
	// Compress the input file using the Huffman codes
	compressedData, err := compressData(file, codes)
	if err != nil {
		return err
	}

	return writeCompressedFile(outFile, compressedData, tree)

}

// calculateFrequencies is a function that calculates the frequency of each character in the input file
func calculateFrequencies(inFile *os.File) (map[rune]int, error) {
	frequencyMap := make(map[rune]int)
	reader := bufio.NewReader(io.Reader(inFile))

	for {
		char, _, err := reader.ReadRune()
		if err != nil {
			if err == io.EOF {
				break
			} else {
				return nil, err
			}
		}
		frequencyMap[char]++
	}
	return frequencyMap, nil
}

// compressData is a function that compresses the input file using the Huffman codes
func compressData(inFile *os.File, codes map[rune]string) ([]byte, error) {
	var compressed bytes.Buffer
	reader := bufio.NewReader(io.Reader(inFile))

	var currentByte byte = 0
	var bitsFilled int = 0

	flushBits := func() {
		if bitsFilled > 0 {
			compressed.WriteByte(currentByte)
			currentByte = 0
			bitsFilled = 0
		}
	}

	for {
		char, _, err := reader.ReadRune()
		if err != nil {
			if err == io.EOF {
				fmt.Println("End of file")
				break
			} else {
				return nil, err
			}
		}

		code := codes[char]
		fmt.Printf("Write %c -> codes[char] %s\n", char, code)
		for _, bit := range code {
			if bit == '1' {
				currentByte = (currentByte << 1) | 1
			} else {
				currentByte <<= 1
			}
			bitsFilled++
			if bitsFilled == 8 {
				compressed.WriteByte(currentByte)
				currentByte = 0
				bitsFilled = 0
			}
		}
	}

	flushBits() // Assurez-vous de flusher les bits restants qui n'ont pas rempli un byte complet

	fmt.Printf("Compressed data: %x\n", compressed.Bytes())
	return compressed.Bytes(), nil
}


// writeCompressedFile is a function that writes the compressed file to the output file, with the Huffman Tree at the beginning (for decompression)
func writeCompressedFile(outFile string, compressedData []byte, tree *common.Tree) error {
	file, err := os.Create(outFile)
	if err != nil {
		return err
	}
	defer file.Close()

	// Serialize the Huffman Tree
	var treeBuffer bytes.Buffer
	treeEncoder := gob.NewEncoder(&treeBuffer)
	err = treeEncoder.Encode(tree)
	if err != nil {
		return err
	}

	// Write the Huffman Tree and the compressed data to the output file
	n, err := file.Write(treeBuffer.Bytes())
	if err != nil {
		return err
	}
	fmt.Printf("Tree length: %d\n", treeBuffer.Len())
	fmt.Printf("Bytes written: %d\n", n)

	_, err = file.Write(compressedData)
	if err != nil {
		return err
	}
	return nil
}
