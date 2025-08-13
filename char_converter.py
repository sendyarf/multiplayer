class CharConverter:
    def __init__(self):
        # Character mapping from the JavaScript decode function
        self.char_map = {
            '4': 'a', 'a': 'b', 'A': 'c', 'e': 'd', 'v': 'e',
            'N': 'f', 'L': 'g', 'C': 'h', 'V': 'i', '-': 'j',
            ':': 'k', 'D': 'l', 'Y': 'm', 'u': 'n', '=': 'o',
            'j': 'p', 'i': 'q', 'y': 'r', 'R': 's', 'c': 't',
            '/': 'u', '8': 'v', '1': 'w', 'U': 'x', '6': 'y',
            '9': 'z', 'S': 'A', 'b': 'B', 'p': 'C', 'Z': 'D',
            's': 'E', 'o': 'F', 'Q': 'G', 'h': 'H', 'k': 'I',
            'K': 'J', 'I': 'K', 'g': 'L', '5': 'M', 'r': 'N',
            'M': 'O', 'l': 'P', '?': 'Q', 'z': 'R', 'm': 'S',
            '7': 'T', 'B': 'U', 'x': 'V', '_': 'W', 'J': 'X',
            'w': 'Y', 'n': 'Z', 't': '0', '&': '1', 'E': '2',
            'T': '3', 'q': '4', '2': '5', '.': '6', 'd': '7',
            'P': '8', 'H': '9', 'F': '.', 'G': '_', 'f': '-',
            '3': '/', 'W': ':', 'X': '&', 'O': '?', '0': '='
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
