2019 - 2021 Browser-based Operating System in TypeScript
========================================================

This is Alan's Operating Systems class initial project.
See https://www.labouseur.com/courses/os/ for details.
It was originally developed by Alan and then enhanced by alums Bob Nisco and Rebecca Murphy over the years.
Clone this into your own private repository. Better yet, download it as a ZIP file and use it to initialize your own repository for this class. 
Then add Alan (userid *Labouseur*) as a collaborator.

Setup TypeScript
================

1. Install the [npm](https://www.npmjs.org/) package manager if you don't already have it.
1. Run `npm install -g typescript` to get the TypeScript Compiler. (You probably need to do this as root.)

-- or -- 

1. [Download](https://www.typescriptlang.org/download) it from the TypeScript website.
2. Execute the intstaller.

Workflow
=============

Some IDEs (e.g., [Visual Studio Code](https://code.visualstudio.com), [IntelliJ IDEA](https://www.jetbrains.com/idea/), others) 
natively support TypeScript-to-JavaScript compilation and have tools for debugging, syntax highlighting, and more.
If your development environment lacks these then you'll have to compile your code from the command line, which is not a bad thing. 
(In fact, I kind of like that option.) Just make sure you configure `tsconfig.json` correctly and test it out.

A Few Notes
===========

**What's TypeScript?**
TypeScript is a language that allows you to write in a statically-typed language that outputs standard JavaScript.
It's all kinds of awesome.

**Why should I use it?**
This will be especially helpful for an OS or a Compiler that may need to run in the browser as you will have all of the great benefits of strong type checking and scope rules built right into your language.

**Where can I get more info on TypeScript**
[Right this way!](http://www.typescriptlang.org/)


Brendon Kupsch's notes:
My brother Evan Kupsch helped me with memeory and pcb implementation, and with difficult errors that I was stuck on.
Using GitHub Copilot to help write this code.
 https://copilot.github.com/ 

 Copilot notes:
    Copilot will begin brackets but rarely predicts closing brackets, leading to some annoying formatting problems that need to be manually fixed. This gets very annoying with complicated code because copilot messes up on the end of most functions.

    Copilot is extremely helpful for commenting code. It does a very good job at reading your code and creating a comment very close to what I would write myself.
     After using GitHub Copilot for some time, it is worth the price of admission for commenting alone. I save so much time not having to write comments myself.
    Copilot is also very good at basic functions like the operational codes. I think this is becasue it has a large database of OS students who wrote similar code.

    Copilot did a great job with initDisplays and updateDisplays functiosn in control.ts.