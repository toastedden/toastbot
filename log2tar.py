import os
import tarfile
import datetime
import re

# Directory paths
logs_dir = './logs'
archives_dir = os.path.join(logs_dir, 'archives')

# Step 1: Check and create directories if needed
os.makedirs(archives_dir, exist_ok=True)

# Step 2: Get previous month's number and year
today = datetime.date.today()
first_day_of_current_month = today.replace(day=1)
last_month = first_day_of_current_month - datetime.timedelta(days=1)
last_month_str = f"{last_month.year}-{last_month.month:02d}"

# Archive filename based on previous month
archive_filename = os.path.join(archives_dir, f"{last_month.strftime('%B-%Y')} Log Files.tar.gz")

# Initialize tarfile for writing
with tarfile.open(archive_filename, "w:gz") as archive:
    print(f"Creating archive: {archive_filename}")

    # Step 3: Search for log files from the previous month
    log_files = [
        f for f in os.listdir(logs_dir)
        if re.match(rf".*_{last_month_str}-\d{{2}}\.log$", f)
    ]

    # Add each log file to the archive
    for log_file in log_files:
        log_file_path = os.path.join(logs_dir, log_file)
        print(f"Adding {log_file_path} to archive.")
        archive.add(log_file_path, arcname=log_file)
    
print("Archive created successfully.")

# Step 4: Remove the archived log files
for log_file in log_files:
    log_file_path = os.path.join(logs_dir, log_file)
    os.remove(log_file_path)
    print(f"Removed archived log file: {log_file_path}")

print(f"All log files from {last_month.strftime('%B %Y')} have been archived and removed from {logs_dir}.")