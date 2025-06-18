from music21 import converter
from pathlib import Path
import re

def rename_xml_files_by_title_with_spaces(folder_path):
    folder = Path(folder_path)

    for file in folder.glob("*.xml"):
        try:
            # Parse the MusicXML file
            score = converter.parse(file, format='musicxml')
            title = score.metadata.title

            if not title:
                print(f"[!] No title found in {file.name}, skipping.")
                continue

            # Keep only letters and spaces, remove everything else
            clean_title = re.sub(r'[^A-Za-z\s]', '', title)

            # Normalize whitespace (remove leading/trailing, collapse multiple spaces)
            clean_title = re.sub(r'\s+', ' ', clean_title).strip()

            if not clean_title:
                print(f"[!] Cleaned title is empty for {file.name}, skipping.")
                continue

            # Construct new file path
            new_file = file.with_name(clean_title + ".xml")

            if new_file.exists():
                print(f"[!] {new_file.name} already exists, skipping.")
                continue

            file.rename(new_file)
            print(f"[✓] Renamed: {file.name} → {new_file.name}")

        except Exception as e:
            print(f"[x] Failed to process {file.name}: {e}")

# Example usage:
rename_xml_files_by_title_with_spaces("./Ryan’s Mammoth Collection")
