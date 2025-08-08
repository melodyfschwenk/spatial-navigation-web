# Spatial Navigation (Web) — Behavioral Only

This folder contains a browser-based version of your task using jsPsych. It presents the same structure (practice + 9 blocks) and collects keyboard responses only. No EEG is used.

## Folder structure

- `web/index.html` — entry point
- `web/main.js` — experiment logic
- `web/style.css` — minimal styling
- `stimulus_mappings.csv` — kept at repo root; the deploy workflow copies it next to the site
- `stimuli/` — your images (`stimuli/easy`, `stimuli/hard`, `stimuli/control`); the deploy workflow copies this folder to the site

## Local test (optional)

Because browsers restrict file access, serve your repo locally:

- Python 3: run in repo root `python -m http.server` and open `http://localhost:8000/web/`
- Or use VS Code Live Server

## Hosting (automatic)

This repository includes a GitHub Actions workflow to deploy the site to GitHub Pages.

1. In GitHub, go to Settings → Pages:
   - Build and deployment → Source: select “GitHub Actions”
2. Push/merge the workflow and web files to `main`.
3. Wait for the “Deploy Pages” workflow to finish.
4. Your study will be at: `https://<username>.github.io/<repo>/`

Share that URL with participants.

## Data

- At the end, a CSV auto-downloads to the participant’s computer.
- Columns (order aligned with your lab version):
  - `participant_id, session, age, gender, handedness,`
  - `block_num, trial_num, navigation_type, difficulty, stimulus_id,`
  - `stimulus_file, correct_direction, response_dir, accuracy,`
  - `rt_s, rt_ms, timestamp, absolute_trial_num, counterbalance`

If you need server-side storage, we can integrate Pavlovia (`jspsych-pavlovia`) in a small update.

## Task details

- Practice: 4 trials (2 PLAYER VIEW [egocentric], 2 MAP VIEW [allocentric])
- Main: 9 sections, 15 trials each
- Fixation: 0.5–0.8 s; Stimulus: up to 3 s or until response
- Practice shows feedback; main does not
- Counterbalancing:
  - If “Auto”, derived from participant ID (Latin square)
  - Or participant selects CB 1–4

## Adjustments

Edit `CONFIG` in `web/main.js` to change timing or counts:
- `trialsPerBlock`, `numPracticeTrials`, `maxResponseTimeMs`, etc.

```


What happens after merge
- The workflow will deploy your site automatically.
- Participants can complete the task anywhere, anytime, using only the keyboard.
- You receive a CSV per participant (they can upload/email it back; we can also wire server storage if desired).

Next step
- Share the repository URL (owner/repo) and I’ll open a pull request that adds these files and enables the deployment.
