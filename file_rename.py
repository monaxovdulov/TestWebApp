import os

# Define the directory containing the files. This will be changed to the actual directory in the user's environment.
directory = "audio/"

# Define the function to rename the files
def rename_files(dir_path):
    for filename in os.listdir(dir_path):
        if filename.startswith("game_chords audio "):
            # Construct the new file name
            new_filename = filename.replace("game_chords ", "")
            # Construct the full old and new file paths
            old_file = os.path.join(dir_path, filename)
            new_file = os.path.join(dir_path, new_filename)
            # Rename the file
            os.rename(old_file, new_file)
            print(f"Renamed '{filename}' to '{new_filename}'")

# Please note that the function call is commented out. This is done so the code does not execute here.
# When ready to run, the user should uncomment the next line and replace "/path/to/directory" with the actual directory.
# rename_files(directory)
rename_files(directory) 