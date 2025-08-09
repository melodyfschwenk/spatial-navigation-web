# Spatial Navigation Task (Web Version) — Behavioral Only

A web-based implementation of a spatial navigation task for behavioral research, stripped of EEG components for online deployment.

## Task Description

This experiment tests spatial navigation abilities using two different reference frames:
- **Egocentric (Player View)**: Navigate from the player's perspective
- **Allocentric (Map View)**: Navigate using absolute map directions
- **Control**: Simple arrow-following task

Participants view maze stimuli and must indicate the first step needed to reach a target location, responding with arrow keys within 3 seconds.

## Features

- **Counterbalanced Design**: Automatic Latin Square counterbalancing based on participant ID 
- **Practice Trials**: 4 practice trials before the main experiment
- **9 Blocks**: 15 trials per block (135 total trials)
- **Data Export**: Automatic CSV download at experiment completion
- **Browser-Based**: No installation required, runs in any modern web browser

## File Structure

```
spatial_navigation_online/
├── webversion.html          # Main experiment file
├── stimulus_mappings.js     # Stimulus-response mappings
├── stimuli/                 # Stimulus images (78 PNG files)
│   ├── 1.png
│   ├── 2.png
│   └── ... (up to 78.png)
├── config/                  # Original configuration files
├── data/                    # Downloaded data will be saved here locally
└── README.md               # This file
```



### Online Deployment

#### Option 1: GitHub Pages (Recommended)

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch" → Main → Root
4. Your task will be available at: `https://[your-username].github.io/spatial_navigation_online/webversion.html`

#### Option 2: Netlify

1. Zip the entire folder
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the zip file
4. Get an instant URL


## Participant Instructions

1. **Access the Task**: Navigate to the provided URL
2. **Enter Information**: Fill in participant ID, age, gender, and handedness
3. **Practice Phase**: Complete 4 practice trials with feedback
4. **Main Experiment**: Complete 9 blocks of 15 trials each
## Data Output

The task generates a CSV file with the following columns:
- `participant_id`: Unique participant identifier
- `block`: Block number (1-9)
- `trial`: Trial number within block (1-15)
- `navigation_type`: egocentric, allocentric, or control
- `difficulty`: easy, hard, or control
- `response`: Participant's response (up, down, left, right, or none)
- `correct_response`: The correct response
- `accuracy`: 1 for correct, 0 for incorrect
- `rt`: Reaction time in milliseconds
- `timestamp`: ISO timestamp of the trial

## Stimulus Information

- **Total Stimuli**: 78 PNG images
- **Categories**: 
  - Easy (1-26): Simple maze configurations
  - Hard (27-52): Complex maze configurations  
  - Control (53-78): Arrow-following tasks
- **Image Size**: 500x500 pixels
- **Format**: PNG with white background

## Counterbalancing

The task uses a 4-condition Latin Square design:
- **CB1**: Ego-Easy → Ego-Hard → Allo-Easy → Allo-Hard
- **CB2**: Ego-Hard → Allo-Hard → Ego-Easy → Allo-Easy
- **CB3**: Allo-Easy → Ego-Easy → Allo-Hard → Ego-Hard
- **CB4**: Allo-Hard → Allo-Easy → Ego-Hard → Ego-Easy

Counterbalance condition is automatically determined from participant ID (ID modulo 4).

## Technical Requirements

### For Participants
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Keyboard with arrow keys
- Stable internet connection (for online version)
- Screen resolution of at least 1024x768

### For Researchers
- Web server or hosting service
- All 78 stimulus images in PNG format
- Properly formatted `stimulus_mappings.js` file

## Troubleshooting

### Images Not Loading
- Ensure all PNG files are in the `stimuli/` folder
- Check that filenames match (1.png through 78.png)
- Verify the local server is running if testing locally

### Data Not Downloading
- Check browser popup blocker settings
- Try a different browser
- Ensure JavaScript is enabled

### Participant ID Issues
- IDs should be alphanumeric
- Avoid special characters
- Use consistent ID format across participants

## Data Analysis

Example R code for loading and analyzing data:
```r
# Load data
data <- read.csv("spatial_nav_participant_timestamp.csv")

# Calculate accuracy by condition
aggregate(accuracy ~ navigation_type + difficulty, data, mean)

# Calculate mean RT for correct trials
correct_trials <- subset(data, accuracy == 1)
aggregate(rt ~ navigation_type + difficulty, correct_trials, mean)
```

## Citation

If you use this task in your research, please cite:
```
[Your Name] (2025). Spatial Navigation Task - Web Version [Computer software]. 
GitHub: https://github.com/[your-username]/spatial_navigation_online
```

## Original Task Credits

This web version is adapted from the PsychoPy-based EEG version of the spatial navigation task.
EEG components have been removed for online behavioral testing.

## License

[Specify your license here - e.g., MIT, GPL, etc.]

## Contact

For questions or issues, please contact:
- [Your Name]
- [Your Email]
- [Your Institution]

## Version History

- v1.0 (2025-08-09): Initial web version, adapted from EEG task
  - Removed all EEG components
  - Added browser-based data collection
  - Implemented automatic counterbalancing
  - Added CSV export functionality
