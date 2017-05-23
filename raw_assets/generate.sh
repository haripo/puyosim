convert noticingPuyos.xcf -crop 16x16 -sample 200% cropped_ojama_%03d.png
mv cropped_ojama_000.png ../assets/ojama_small.png
mv cropped_ojama_001.png ../assets/ojama_large.png
mv cropped_ojama_002.png ../assets/ojama_stone.png
mv cropped_ojama_003.png ../assets/ojama_mushroom.png
mv cropped_ojama_004.png ../assets/ojama_star.png
mv cropped_ojama_005.png ../assets/ojama_crown.png
rm -f cropped_ojama_*

