convert puyos.xcf -crop 16x16 -sample 400% cropped_puyo_%03d.png
mv cropped_puyo_000.png ../assets/puyo_red.png
mv cropped_puyo_001.png ../assets/puyo_green.png
mv cropped_puyo_002.png ../assets/puyo_blue.png
mv cropped_puyo_003.png ../assets/puyo_yellow.png
mv cropped_puyo_004.png ../assets/puyo_purple.png

mv cropped_puyo_010.png ../assets/puyo_red_connect_horizontal.png
mv cropped_puyo_011.png ../assets/puyo_green_connect_horizontal.png
mv cropped_puyo_012.png ../assets/puyo_blue_connect_horizontal.png
mv cropped_puyo_013.png ../assets/puyo_yellow_connect_horizontal.png
mv cropped_puyo_014.png ../assets/puyo_purple_connect_horizontal.png

mv cropped_puyo_020.png ../assets/puyo_red_connect_vertical.png
mv cropped_puyo_021.png ../assets/puyo_green_connect_vertical.png
mv cropped_puyo_022.png ../assets/puyo_blue_connect_vertical.png
mv cropped_puyo_023.png ../assets/puyo_yellow_connect_vertical.png
mv cropped_puyo_024.png ../assets/puyo_purple_connect_vertical.png

mv cropped_puyo_030.png ../assets/puyo_red_char.png
mv cropped_puyo_031.png ../assets/puyo_green_char.png
mv cropped_puyo_032.png ../assets/puyo_blue_char.png
mv cropped_puyo_033.png ../assets/puyo_yellow_char.png
mv cropped_puyo_034.png ../assets/puyo_purple_char.png

mv cropped_puyo_040.png ../assets/puyo_red_connect_horizontal_char.png
mv cropped_puyo_041.png ../assets/puyo_green_connect_horizontal_char.png
mv cropped_puyo_042.png ../assets/puyo_blue_connect_horizontal_char.png
mv cropped_puyo_043.png ../assets/puyo_yellow_connect_horizontal_char.png
mv cropped_puyo_044.png ../assets/puyo_purple_connect_horizontal_char.png

mv cropped_puyo_050.png ../assets/puyo_red_connect_vertical_char.png
mv cropped_puyo_051.png ../assets/puyo_green_connect_vertical_char.png
mv cropped_puyo_052.png ../assets/puyo_blue_connect_vertical_char.png
mv cropped_puyo_053.png ../assets/puyo_yellow_connect_vertical_char.png
mv cropped_puyo_054.png ../assets/puyo_purple_connect_vertical_char.png

convert noticingPuyos.xcf -crop 16x16 -sample 400% cropped_ojama_%03d.png
mv cropped_ojama_000.png ../assets/ojama_small.png
mv cropped_ojama_001.png ../assets/ojama_large.png
mv cropped_ojama_002.png ../assets/ojama_stone.png
mv cropped_ojama_003.png ../assets/ojama_mushroom.png
mv cropped_ojama_004.png ../assets/ojama_star.png
mv cropped_ojama_005.png ../assets/ojama_crown.png

convert misc.xcf -crop 16x16 -sample 400% cropped_misc_%03d.png
mv cropped_misc_000.png ../assets/cross.png

convert controls.xcf -crop 32x32 -sample 400% cropped_controls_%03d.png
mv cropped_controls_000.png ../assets/control_a.png
mv cropped_controls_001.png ../assets/control_b.png
mv cropped_controls_002.png ../assets/control_left.png
mv cropped_controls_003.png ../assets/control_right.png
mv cropped_controls_004.png ../assets/control_down.png

convert icon.xcf -crop 16x16 cropped_icon_%03d.png
convert cropped_icon_000.png -sample 300% png32:../android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert cropped_icon_000.png -sample 300% png32:../android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert cropped_icon_000.png -sample 450% png32:../android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert cropped_icon_000.png -sample 450% png32:../android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert cropped_icon_000.png -sample 600% png32:../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert cropped_icon_000.png -sample 600% png32:../android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert cropped_icon_000.png -sample 900% png32:../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert cropped_icon_000.png -sample 900% png32:../android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert cropped_icon_000.png -sample 1200% png32:../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
convert cropped_icon_000.png -sample 1200% png32:../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
cp cropped_icon_000.png icon.png

rm -f cropped_*
