class CharConverter:
    def __init__(self):
        # Character mapping from the JavaScript decode function
        self.char_map = {
    '9': 'a',
    'F': 'b',
    'a': 'c',
    'u': 'd',
    '4': 'e',
    'X': 'f',
    'q': 'g',
    'A': 'h',
    '6': 'i',
    'M': 'j',
    '/': 'k',
    'n': 'l',
    'Z': 'm',
    '?': 'n',
    '1': 'o',
    '_': 'p',
    'P': 'q',
    'm': 'r',
    'K': 's',
    's': 't',
    't': 'u',
    'L': 'v',
    'D': 'w',
    'c': 'x',
    '=': 'y',
    'z': 'z',
    '0': 'A',
    '2': 'B',
    'f': 'C',
    'e': 'D',
    'S': 'E',
    'O': 'F',
    'y': 'G',
    'd': 'H',
    'i': 'I',
    '5': 'J',
    'h': 'K',
    'w': 'L',
    'E': 'M',
    'r': 'N',
    '-': 'O',
    'o': 'P',
    'T': 'Q',
    'C': 'R',
    '.': 'S',
    '3': 'T',
    'R': 'U',
    'B': 'V',
    'U': 'W',
    '&': 'X',
    'G': 'Y',
    'J': 'Z',
    'H': '0',
    'l': '1',
    'k': '2',
    'j': '3',
    'N': '4',
    'b': '5',
    'g': '6',
    'x': '7',
    'Y': '8',
    '8': '9',
    'I': '.',
    ':': '_',
    'v': '-',
    '7': '/',
    'Q': ':',
    'V': '&',
    'W': '?',
    'p': '='
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
