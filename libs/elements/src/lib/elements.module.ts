import { NgModule } from "@angular/core";

import { AvatarModule } from "./avatar/index";
import { BalloonModule } from "./balloon/index";
import { FlipModule } from "./flip/index";
import { HighlightModule } from "./highlight/index";
import { IconModule } from "./icon/index";
import { IllustrationModule } from "./illustration/index";
import { ImageModule } from "./image/index";
import { InkbarModule, NavInkbarModule } from "./inkbar/index";
import { LogoModule } from "./logo/index";
import { SpinnerModule } from "./spinner/index";
import { ThumbnailModule } from "./thumbnail/index";
import { TogglerModule } from "./toggler/index";

@NgModule({
  imports: [
    AvatarModule,
    BalloonModule,
    FlipModule,
    HighlightModule,
    IconModule,
    IllustrationModule,
    ImageModule,
    InkbarModule,
    NavInkbarModule,
    LogoModule,
    SpinnerModule,
    ThumbnailModule,
    TogglerModule
  ],
  declarations: [],
  exports: []
})
export class AnimateModule {}
