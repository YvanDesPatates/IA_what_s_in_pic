#!/usr/bin/env python3

import heapq
from collections import defaultdict
from PIL import Image
import pickle
import time
import os
import sys

class HuffmanNode:
    def __init__(self, freq, pixel=None, left=None, right=None):
        self.freq = freq
        self.pixel = pixel
        self.left = left
        self.right = right

    def __lt__(self, other):
        return self.freq < other.freq

def build_frequency_table(image_data):
    frequency_table = defaultdict(int)
    for pixel in image_data:
        frequency_table[pixel] += 1
    return frequency_table

def build_huffman_tree(frequency_table):
    heap = []
    for pixel, freq in frequency_table.items():
        heapq.heappush(heap, HuffmanNode(freq, pixel=pixel))
    
    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = HuffmanNode(left.freq + right.freq, left=left, right=right)
        heapq.heappush(heap, merged)
    
    return heap[0]

def build_codewords_table(node, prefix="", codewords_table={}):
    if node is None:
        return {}
    
    if node.pixel is not None:
        codewords_table[node.pixel] = prefix
    else:
        build_codewords_table(node.left, prefix + "0", codewords_table)
        build_codewords_table(node.right, prefix + "1", codewords_table)
    
    return codewords_table

def load_image(image_path):
    if not image_path.lower().endswith('.webp'):
        raise ValueError("Le fichier n'est pas une image WEBP.")
    with Image.open(image_path) as img:
        img = img.convert('RGB')
        original_size = img.size
        new_size = (original_size[0] // 2, original_size[1] // 2)
        img_resized = img.resize(new_size, Image.LANCZOS)
        image_data = list(img_resized.getdata())
    return image_data, img_resized.size

def save_image(image_data, size, output_path):
    image = Image.new('RGB', size)
    image.putdata(image_data)
    image.save(output_path)

def save_compression(output_path, compressed_data, huffman_tree, size):
    compressed_data_hex = hex(int(compressed_data, 2))[2:]
    compressed_data_length = len(compressed_data)
    with open(f"{output_path}_compressed.pkl", "wb") as f:
        pickle.dump((compressed_data_hex, compressed_data_length, huffman_tree, size), f)

def load_compression(input_path):
    with open(input_path, "rb") as f:
        compressed_data_hex, compressed_data_length, huffman_tree, size = pickle.load(f)
    compressed_data = bin(int(compressed_data_hex, 16))[2:].zfill(compressed_data_length)
    return compressed_data, huffman_tree, size

def compress_image(image_path, output_name):
    start_time = time.time()
    try:
        image_data, size = load_image(image_path)
    except ValueError as e:
        print(e)
        return
    frequency_table = build_frequency_table(image_data)
    huffman_tree = build_huffman_tree(frequency_table)
    codewords_table = build_codewords_table(huffman_tree)

    compressed_data = []
    for pixel in image_data:
        compressed_data.append(codewords_table[pixel])

    compressed_data_str = ''.join(compressed_data)
    save_compression(output_name, compressed_data_str, huffman_tree, size)
    end_time = time.time()
    print(f"Compression de '{image_path}' terminée en {end_time - start_time} secondes.")
    return compressed_data_str, huffman_tree, size

def decompress_image(compressed_data, huffman_tree, size, output_path):
    start_time = time.time()
    decompressed_image = []
    current_node = huffman_tree

    for bit in compressed_data:
        if bit == '0':
            current_node = current_node.left
        else:
            current_node = current_node.right

        if current_node.pixel is not None:
            decompressed_image.append(current_node.pixel)
            current_node = huffman_tree

    save_image(decompressed_image, size, output_path)
    end_time = time.time()
    print(f"Décompression terminée en {end_time - start_time} secondes.")

def main(image_path):
    if not image_path.lower().endswith('.webp'):
        print("L'image doit être au format WEBP.")
        return
    
    output_name = f"compressed_{os.path.splitext(os.path.basename(image_path))[0]}"
    start_time = time.time()
    compressed_data, huffman_tree, size = compress_image(image_path, output_name)
    if compressed_data:
        print("Données compressées affichées partiellement pour économiser de l'espace.")
    
    compressed_data, huffman_tree, size = load_compression(f'{output_name}_compressed.pkl')
    decompress_image(compressed_data, huffman_tree, size, f"{output_name}.webp")
    print(f"Image décompressée '{output_name}.webp' sauvegardée avec succès.")
    end_time = time.time()
    print(f"Le processus complet a été terminé en {end_time - start_time} secondes.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Veuillez spécifier le nom de l'image en argument.")
        sys.exit(1)
    main(sys.argv[1])