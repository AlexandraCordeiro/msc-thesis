from pathlib import Path
from tqdm import tqdm
from score_helper_functions import Score, get_nodes, get_links
from audio_helper_functions import audio_time_series, get_spectogram_data, get_fundamental_frequency, get_onsets
import json
import pandas as pd
import gc  # Garbage collector

collection_of_tunes_dir = Path('../app/public')
mxml_files = Path("./IE-2019-D-HLS")
audio_files = collection_of_tunes_dir / "audio_files"

audio_vs_score = collection_of_tunes_dir / "audio_vs_score"
audio_vs_score.mkdir(exist_ok=True)


""" print(mxml_files)
print(audio_files) """


score_contour = {}


# load csv
df = pd.read_csv("tune_duration.csv", na_values=["None"])

# get score contour notes and timestamps
for tune in mxml_files.iterdir():
    try:
        filename = tune.name.split(".")[0]
        score = Score(tune)
        note_timestamps = score.get_note_timestamps()
        score_contour[filename] = note_timestamps
    except:
        print("An error occured.")

# get audio contour and onsets
for audio in tqdm(audio_files.glob('*.mp3')):
    
    filename = audio.name.split(".")[0]
    print(filename)
    num = int(filename.split('-')[-1])
    print(num)
    try:
      row = df[df["id"] == filename].iloc[0]
      start = row["start"]
      end = row["end"]
      
      if pd.isna(end):
        end = None

      y, sr = audio_time_series(audio, start=start, end=end)
      
      # Spectogram
      spectogram_data = get_spectogram_data(y=y, sr=sr)
      
      # Fundamental Frequency
      f0, time_f0, f0_db = get_fundamental_frequency(y=y, sr=sr, spectogram_data=spectogram_data)
      melodic_contour = [{"time": time_f0.tolist(), "f0": f0.tolist()}]
      
      # Onset Detection
      # onset_frames, onset_times = get_onsets(y=y, sr=sr)

      # Save data to json file
      # "onset_times": onset_times.tolist(), 
      data = {"audio_spectogram_data": spectogram_data, "melodic_contour": melodic_contour, "score_contour": score_contour[filename]}


      # save to 'Audio vs Score' data folder
      print(">> {filename}")
      print()
      with open(audio_vs_score / f"{filename}_audio_vs_score.json", "w") as f:
          json.dump(data, f)

      # , onset_frames, onset_times
      del y, sr, f0, time_f0, f0_db, spectogram_data
      gc.collect()
    except Exception as e:
      print(f"Error: {filename}\n{e}")
      continue






""" 
intervals_info_about_mxml_files = []
for tune in tqdm(mxml_files.iterdir()):
  try:
    tune_name = f"{tune}".split("/")[-1].split(".")[0]
    print(tune_name)
    score = Score(tune)
    notes = list(score.get_all_notes()['pitch'])
    info = {"name": tune_name, 'nodes': get_nodes(notes), 'links': get_links(notes)}
    intervals_info_about_mxml_files.append(info)
  except:
    print(">> an error occurred!!")
    
"""