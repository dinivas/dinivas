import { Module } from '@nestjs/common';
import { JenkinsModule } from './jenkins/jenkins.module';
import { GitlabModule } from './gitlab/gitlab.module';
import { DroneciModule } from './droneci/droneci.module';

@Module({
  imports: [JenkinsModule, GitlabModule, DroneciModule]
})
export class BuildModule {}
