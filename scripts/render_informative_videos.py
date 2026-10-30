import subprocess
import os

os.makedirs("public/assets/videos", exist_ok=True)

font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

videos_config = [
    {
        "output": "public/assets/videos/hh_how_it_works.mp4",
        "image": "src/assets/images/video_thumb_how_it_works_1793357739439.jpg",
        "badge": "HOW IT WORKS · HAPPY HANGOUTS",
        "title": "How Happy Hangouts Works in 60s",
        "sub": "Akele kyu? Happy Hangouts Hai na!!",
        "steps": [
            ("0", "3", "STEP 1: Pick an activity — Badminton, Cafe, Treks or Music"),
            ("3", "6", "STEP 2: Choose 100% ID-verified companions in Gurugram & Delhi"),
            ("6", "9", "STEP 3: Meet at verified public hubs (DLF CyberHub, CP, Khan Mkt)"),
            ("9", "12", "STEP 4: UPI Escrow Safe — Funds only released after you approve!")
        ],
        "chord": "0.06*sin(2*PI*261.6*t) + 0.05*sin(2*PI*329.6*t) + 0.05*sin(2*PI*392.0*t) + 0.04*sin(2*PI*523.2*t)"
    },
    {
        "output": "public/assets/videos/hh_safety_shield.mp4",
        "image": "src/assets/images/video_thumb_safety_escrow_1793357740741.jpg",
        "badge": "TRUST & SAFETY · 4-PILLAR SHIELD",
        "title": "The 4-Pillar Safety Shield & Biometrics",
        "sub": "Your safety and financial peace of mind are guaranteed",
        "steps": [
            ("0", "3", "PILLAR 1: Govt ID (Aadhaar/PAN) + Live Biometric Face Matching"),
            ("3", "6", "PILLAR 2: Public Places Only — CyberHub, Siri Fort & Khan Market"),
            ("3", "6", "PILLAR 2: Strictly Public Places — No Private Home Meetups Ever"),
            ("6", "9", "PILLAR 3: Real-Time Session Timer & 1-Tap SOS Emergency Beacon"),
            ("9", "12", "PILLAR 4: Mutual 2-Way Reviews — Zero Tolerance for Bad Actors")
        ],
        "chord": "0.06*sin(2*PI*220.0*t) + 0.05*sin(2*PI*277.1*t) + 0.05*sin(2*PI*329.6*t) + 0.04*sin(2*PI*440.0*t)"
    },
    {
        "output": "public/assets/videos/hh_hosts_spotlight.mp4",
        "image": "src/assets/images/video_thumb_host_spotlight_1793357740785.jpg",
        "badge": "HOST SPOTLIGHT · GURUGRAM & DELHI",
        "title": "Meet Our Hosts: Ujjwal, Sonika, Jyoti & Falguni",
        "sub": "Real badminton champions, coffee lovers & trek leaders",
        "steps": [
            ("0", "3", "UJJWAL POONIA: Badminton rallies & court drills in Sector 29"),
            ("3", "6", "SONIKA SHARMA: Pour-over coffee & startup talks at DLF CyberHub"),
            ("6", "9", "JYOTI NANDAL: Sunrise heritage walks & trails at Sunder Nursery"),
            ("9", "12", "FALGUNI BADDI: Acoustic jamming & indie open mics in Central Delhi")
        ],
        "chord": "0.06*sin(2*PI*293.6*t) + 0.05*sin(2*PI*369.9*t) + 0.05*sin(2*PI*440.0*t) + 0.04*sin(2*PI*587.3*t)"
    },
    {
        "output": "public/assets/videos/hh_community_walks.mp4",
        "image": "src/assets/images/video_thumb_community_walk_1793357742267.jpg",
        "badge": "COMMUNITY STORIES · DELHI NCR",
        "title": "No More Solo Weekends in Gurugram & Delhi",
        "sub": "How newcomers make authentic activity friends without dating apps",
        "steps": [
            ("0", "3", "New in town? Skip the awkward dating app chatter and noise"),
            ("3", "6", "Connect for an hour over sports, board games or specialty chai"),
            ("6", "9", "Pay hourly with zero subscriptions and zero awkward expectations"),
            ("9", "12", "Find your weekend tribe across Gurugram, Delhi & South NCR")
        ],
        "chord": "0.06*sin(2*PI*261.6*t) + 0.05*sin(2*PI*349.2*t) + 0.05*sin(2*PI*392.0*t) + 0.04*sin(2*PI*523.2*t)"
    },
    {
        "output": "public/assets/videos/hh_host_earnings.mp4",
        "image": "src/assets/images/video_thumb_host_spotlight_1793357740785.jpg",
        "badge": "HOST MASTERCLASS · EARN IN NCR",
        "title": "Earn Rs 25,000 - Rs 40,000/mo as a Host",
        "sub": "Get paid to share your hobbies on your own flexible schedule",
        "steps": [
            ("0", "3", "Love badminton, cafe hopping, photography or trekking?"),
            ("3", "6", "Set your hourly rate (Rs 300 to Rs 700/hr) on your terms"),
            ("6", "9", "Keep 80% take-home pay with automated weekly direct UPI transfers"),
            ("9", "12", "Become a verified founding host in Gurugram & Delhi today!")
        ],
        "chord": "0.06*sin(2*PI*329.6*t) + 0.05*sin(2*PI*392.0*t) + 0.05*sin(2*PI*493.8*t) + 0.04*sin(2*PI*659.2*t)"
    }
]

for cfg in videos_config:
    print(f"Rendering {cfg['output']}...")
    
    # Video filter chain:
    # 1. Scale and crop image to 1280x720 with slow smooth zoom
    # 2. Add top header badge bar
    # 3. Add title card
    # 4. Add dynamic lower-third steps that animate over time
    
    draw_filters = []
    
    # Ken Burns slow zoom
    draw_filters.append("scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720")
    
    # Dark gradient scrim at top and bottom for readability
    draw_filters.append("drawbox=x=0:y=0:w=1280:h=150:color=black@0.75:t=fill")
    draw_filters.append("drawbox=x=0:y=560:w=1280:h=160:color=black@0.85:t=fill")
    
    # Top badge & brand text
    draw_filters.append(f"drawtext=fontfile='{font_path}':text='{cfg['badge']}':fontcolor=0xFFC933:fontsize=22:x=40:y=30:box=1:boxcolor=0x0B1F5C@0.9:boxborderw=8")
    draw_filters.append(f"drawtext=fontfile='{font_path}':text='{cfg['title']}':fontcolor=white:fontsize=36:x=40:y=72")
    draw_filters.append(f"drawtext=fontfile='{font_path}':text='{cfg['sub']}':fontcolor=0x7CC4FF:fontsize=18:x=40:y=118")
    
    # Step lower-third overlays with enable intervals
    for start_t, end_t, text in cfg["steps"]:
        # Yellow pill badge + bold white text
        safe_text = text.replace("'", "").replace(":", " -")
        draw_filters.append(
            f"drawtext=fontfile='{font_path}':text='{safe_text}':fontcolor=0x0B1F5C:fontsize=26:x=40:y=610:box=1:boxcolor=0xFFC933@0.95:boxborderw=14:enable='between(t,{start_t},{end_t})'"
        )

    vf_chain = ",".join(draw_filters)
    
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", cfg["image"],
        "-f", "lavfi", "-i", f"aevalsrc=({cfg['chord']})*(1 - 0.5*cos(2*PI*t/3)):d=12:s=44100",
        "-vf", vf_chain,
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p", "-t", "12",
        "-c:a", "aac", "-b:a", "128k", "-shortest",
        cfg["output"]
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error rendering {cfg['output']}: {res.stderr[-500:]}")
    else:
        print(f"Success: {cfg['output']}")

print("All informative videos rendered successfully!")
