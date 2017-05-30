convert puyos.xcf -crop 16x16 -sample 400% cropped_puyo_%03d.png
convert cropped_puyo_000.png -sample 800% png32:icon.png
mv cropped_puyo_000.png ../assets/puyo_red.png
mv cropped_puyo_001.png ../assets/puyo_green.png
mv cropped_puyo_002.png ../assets/puyo_blue.png
mv cropped_puyo_003.png ../assets/puyo_yellow.png

convert noticingPuyos.xcf -crop 16x16 -sample 400% cropped_ojama_%03d.png
mv cropped_ojama_000.png ../assets/ojama_small.png
mv cropped_ojama_001.png ../assets/ojama_large.png
mv cropped_ojama_002.png ../assets/ojama_stone.png
mv cropped_ojama_003.png ../assets/ojama_mushroom.png
mv cropped_ojama_004.png ../assets/ojama_star.png
mv cropped_ojama_005.png ../assets/ojama_crown.png

convert misc.xcf -crop 16x16 -sample 400% cropped_misc_%03d.png
mv cropped_misc_000.png ../assets/cross.png


rm -f cropped_*
