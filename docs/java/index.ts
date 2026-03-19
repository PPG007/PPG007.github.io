import { GroupConfig } from '@doc-types';
import basic from './basic';
import annotationReflection from './annotation-reflection';
import concurrent from './concurrent';
import dubbo from './dubbo';
import io from './io';
import kb from './kb';
import mybatis from './mybatis';
import net from './net';
import netty from './netty';
import spring from './spring';
import springBoot from './spring-boot';
import springMVC from './spring-mvc';
import springCloud from './spring-cloud';

const config: GroupConfig = {
  text: 'Java',
  icon: 'material-icon-theme:java',
  children: [
    basic,
    io,
    annotationReflection,
    concurrent,
    net,
    mybatis,
    netty,
    spring,
    springBoot,
    springMVC,
    dubbo,
    springCloud,
    kb,
  ],
  dir: __dirname,
};

export default config;
