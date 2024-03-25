package main

import (
	"fmt"
	"huffio/pkg/compress"
	"huffio/pkg/decompress"
	"os"
)

func main() {
	if len(os.Args) < 4 {
		fmt.Println("Usage: ./huff [-c|-d] <file> <output>")
		os.Exit(1)
	}

	if os.Args[1] == "-c" {
		err := compress.Compress(os.Args[2], os.Args[3])
		if err != nil {
			panic(err)
		}
	} else if os.Args[1] == "-d" {
		err := decompress.Decompress(os.Args[2], os.Args[3])
		if err != nil {
			panic(err)
		}
	} else {
		fmt.Println("Usage: ./huff [-c|-d] <file> <output>")
		os.Exit(1)
	}
}
