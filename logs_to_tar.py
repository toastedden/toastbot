import os
import tarfile
import datetime
import re
import shutil

# Directory paths
logs_dir = './logs'
archives_dir = os.path.join(logs_dir, 'archives')
backup_dir = '/mnt/toastbot-backups'

# Step 1: Check and create directories if needed
os.makedirs(archives_dir, exist_ok=True)

# Step 2: Get today's date and initialize the current month
today = datetime.date.today()
current_month = today.replace(day=1)

# Step 3: Iterate through previous months to check for logs and create archives
while True:
    last_month = current_month - datetime.timedelta(days=1)
    last_month_str = f"{last_month.year}-{last_month.month:02d}"
    
    # Archive filename based on the previous month - using hyphens instead of spaces
    archive_filename = os.path.join(archives_dir, f"{last_month.strftime('%B-%Y').lower()}-log-files.tar.gz")
    
    # Skip if archive already exists
    if os.path.exists(archive_filename):
        print(f"Archive for {last_month.strftime('%B %Y')} already exists. Skipping.")
    else:
        # Collect log files for this month
        log_files = [
            f for f in os.listdir(logs_dir)
            if re.match(rf".*_{last_month_str}-\d{2}\.log$", f)
            and os.path.isfile(os.path.join(logs_dir, f))  # Ensure it's a file
        ]
        
        # Only create an archive if there are log files for the month
        if log_files:
            try:
                with tarfile.open(archive_filename, "w:gz") as archive:
                    print(f"Creating archive: {archive_filename}")
                    for log_file in log_files:
                        log_file_path = os.path.join(logs_dir, log_file)
                        print(f"Adding {log_file_path} to archive.")
                        archive.add(log_file_path, arcname=log_file)
                print("Archive created successfully.")
                
                # Copy to backup location if it exists
                if os.path.exists(backup_dir):
                    try:
                        shutil.copy2(archive_filename, backup_dir)
                        print(f"Copied archive to backup location: {backup_dir}")
                    except Exception as e:
                        print(f"Failed to copy to backup location: {str(e)}")
                
                # Step 4: Remove the archived log files
                for log_file in log_files:
                    log_file_path = os.path.join(logs_dir, log_file)
                    try:
                        os.remove(log_file_path)
                        print(f"Removed archived log file: {log_file_path}")
                    except Exception as e:
                        print(f"Failed to remove log file {log_file_path}: {str(e)}")
            except Exception as e:
                print(f"Failed to create archive {archive_filename}: {str(e)}")
        else:
            print(f"No log files found for {last_month.strftime('%B %Y')}. Breaking loop.")
            break
    
    # Stop if last month is before the first log file's date
    if last_month.year < today.year - 1 or (last_month.year == today.year - 1 and last_month.month == 1):
        break
    
    # Update current month to the last month
    current_month = last_month
