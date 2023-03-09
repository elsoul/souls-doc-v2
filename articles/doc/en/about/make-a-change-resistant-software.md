---
id: make-a-change-resistant-software
title: Make software that is resistant to change
description: Software should be as robust to change as possible, especially in production. Because your business needs to adapt to change. Every business has to make and operate software well to prosper.
---

Software should be as robust to change as possible, especially in production. Because your business needs to adapt to change. Every business has to make and operate software well to prosper.

![Error risk](/imgs/docs/shark.jpg)

## The cost of change is high

The software industry as a whole has not focused on code maintainability, resulting in higher costs and more effort spent on software maintenance than originally used for development.

If software is used, the need for changes and updates is unavoidable.

Adding features is one of the most common requests, but until recently, the industry didn't have a proper way to add features. Differences between maintenance and development teams make bugs caused by poor understanding of the code more common.

Developers often spend more time reading than writing code. As a result, they'll often try to re-write rather than modify original code. Many teams try to add the required functionality in their own way, rather working based on a shared understanding of design. As a result, the quality of the entire system deteriorates, making further code extension more difficult.

Most software is not designed to handle enhancements well and requires redesign to add functionality, which is risky and costly.

As a result, developers may add existing code without touching it. The entangled nature of software makes it difficult to add functionality without the domino effect. New features create new bugs, and even more. It's not uncommon for fixing one bug to create another in an endless cycle ...

## Bug fixes

Bugs are the main reason software development projects fail. The cost of fixing bugs is high. It increases development costs geometrically, stops projects, and ruins the system.

In fact, few software developers spend a lot of time fixing bugs. Some bugs are harmful and take a long time to fix, but many are trivial. The only trivial problem, nevertheless, is that it's hard to find bugs first.

As of 2013, MacOSX contained about 85 million lines of source code, which can be crashed with just one typo. There are many types of bugs. Bugs include everything from small things like typos that the compiler can't find to big things like design flaws in the entire system.

Single bugs are often just the tip of the iceberg; in many cases developers will be fixing multiple other bugs while fixing one. The structure of software is often intertwined, and fixing a single bug can lead to a whac-a-mole situation. Fixes that you thought would be done in minutes can be a wave of change that reaches the entire system.

In other words, the real problem to solve is, "How can we make it easier to find and fix bugs?"

## Make it small and write a unit test

Our answer is this.

"Tests show that bugs do exist, not that they do not exist."

Test code confirms whether or not single funcions work in isolation of other functions. If the test code does not exist, releasing code becomes conceptually the same as selling consumers products that have not properly been inspected.

Our philosophy is writing code in small parts, and testing each part individually. Since you can check each operation while developing or fixing bugs, you can narrow the search range when a bug occurs, and the bug can be dealt with rapidly. In addition, the domino effect, which causes a series of bugs, can be suppressed as much as possible.

If you try to improve the quality later, it will cost many times more than building the quality from the beginning. While unit testing seems to be more expensive at first glance, it represents an investment in the final code base, where being able to rapidly respond to feature requests and bug fixes saves time. You can obtain sustainable business agility, which has been difficult until now, while suppressing the cost.

SOULs is designed so that if each operation is confirmed, the whole will work, and the test code is automatically generated at the same time as scaffolding, so software can be built safely and quickly.
