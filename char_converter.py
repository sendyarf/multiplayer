class CharConverter:
    def __init__(self):
        # Character mapping from the JavaScript decode function
        self.char_map = {
            'o': 'a', 'x': 'b', 'b': 'c', 'B': 'd', 'a': 'e',
            'r': 'f', 'X': 'g', 'P': 'h', '3': 'i', '_': 'j',
            'h': 'k', 'J': 'l', 'T': 'm', 'C': 'n', 'w': 'o',
            '1': 'p', 'v': 'q', 'd': 'r', 'e': 's', 'u': 't',
            'k': 'u', '?': 'v', 'q': 'w', 'l': 'x', 'j': 'y',
            't': 'z', '.': 'A', ':': 'B', 'I': 'C', '&': 'D',
            'f': 'E', 'U': 'F', '=': 'G', 'S': 'H', 'c': 'I',
            's': 'J', '7': 'K', 'n': 'L', 'y': 'M', 'H': 'N',
            '/': 'O', 'p': 'P', 'V': 'Q', '4': 'R', 'Z': 'S',
            'N': 'T', 'F': 'U', 'G': 'V', 'K': 'W', '5': 'X',
            '-': 'Y', 'g': 'Z', 'z': '0', 'L': '1', 'i': '2',
            'D': '3', 'm': '4', 'A': '5', '2': '6', '6': '7',
            '0': '8', '9': '9', 'M': '.', '8': '_', 'O': '-',
            'R': '/', 'Q': ':', 'Y': '&', 'W': '?', 'E': '='
        }
        
        # Create reverse mapping for encoding
        self.reverse_map = {v: k for k, v in self.char_map.items()}

    def decode(self, text):
        """Decode the given text using the character mapping."""
        return ''.join(self.char_map.get(char, char) for char in text)
    
    def encode(self, text):
        """Encode the given text using the reverse character mapping."""
        return ''.join(self.reverse_map.get(char, char) for char in text)

def main():
    converter = CharConverter()
    
    while True:
        print("\nMenu:")
        print("1. Decode text")
        print("2. Encode text")
        print("3. Exit")
        
        choice = input("Enter your choice (1-3): ")
        
        if choice == '1':
            text = input("Enter text to decode: ")
            try:
                result = converter.decode(text)
                print(f"Decoded: {result}")
            except Exception as e:
                print(f"Error decoding: {e}")
                
        elif choice == '2':
            text = input("Enter text to encode: ")
            try:
                result = converter.encode(text)
                print(f"Encoded: {result}")
            except Exception as e:
                print(f"Error encoding: {e}")
                
        elif choice == '3':
            print("Exiting...")
            break
            
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
