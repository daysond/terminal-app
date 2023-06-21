const fs = [{
    parent: null,
    name: "root",
    year: 2023,
    type: "directory",
    level: 0,
    children: [
        {
        name: "start_here.txt",
        type: "file",
        year: 2023,
        editable: false,
        parent: "root",
        content: "Type 'request' to request a challenge.\nType 'help' for a list of commands."
        },
        {
        name: "journal.txt",
        type: "file",
        year: 2023,
        editable: false,
        parent: "root",
        content: "Success! You've managed to infiltrate Commander Lambda's evil organization, and finally earned yourself an entry-level position as a Minion on her space station. From here, you just might be able to subvert her plans to use the LAMBCHOP doomsday device to destroy Bunny Planet. Problem is, Minions are the lowest of the low in the Lambda hierarchy. Better buck up and get working, or you'll never make it to the top..."
        }
    ]
},
{
    name: "solar-doomsday",
    level: 1,
    question: 1,
    timeLimit: 24,
    intro:"Commander Lambda sure is a task-master, isn't she? You're being worked to the bone!",
    outro:"You survived a week in Commander Lambda's organization, and you even managed to get yourself promoted. Hooray! Henchmen still don't have the kind of security access you'll need to take down Commander Lambda, though, so you'd better keep working. Chop chop!",
    year: 2023,
    type: "directory",
    parent: null,
    children: [
        {
        name: "readme.txt",
        type: "file",
        editable: false,
        parent: "solar-doomsday",
        content: `
Solar Doomsday
==============
Write a function named 'solution' that takes twp parameter, which are numbers. Your function should return the addition of the two numbers.

For example, calling solution(5, 10) should return 15.`
        },
        {
        name: "solution.py",
        type: "file",
        editable: true,
        parent: "solar-doomsday",
        content: "# provide your solution here ...\ndef solution(a, b):\n   pass"
        }
    ]
    },
    {
        name: "ion-flux-relabeling",
        level: 2,
        question: 1,
        timeLimit: 24,
        intro:"You got the guards to teach you a card game today, it's called Fizzbin. It's kind of pointless, but they seem to like it and it helps you pass the time while you work your way up to Commander Lambda's inner circle.",
        year: 2023,
        type: "directory",
        parent: null,
        children: [
            {
            name: "readme.txt",
            type: "file",
            editable: false,
            parent: "ion-flux-relabeling",
            content: `
Ion Flux Relabeling
===================
Write a function named 'solution' that takes a parameter, which is a string. Your function should return a list of all the indexes in the string that have capital letters.

For example, calling solution("HeLlO") should return the list [0, 2, 4].
            
Use verify [file] to test your solution and see how it does. When you are finished editing your code, use submit [file] to submit your answer. If your solution passes the test cases, it will be removed from your home folder.
            `
            },
            {
            name: "solution.py",
            type: "file",
            editable: true,
            parent: "ion-flux-relabeling",
            content: "# provide your solution here ...\ndef solution(string):\n   pass"
            }
        ]
    },
    {
        name: "lovely-lucky-lambs",
        level: 2,
        question: 2,
        timeLimit: 24,
        intro:"Rumor has it the prison guards are inexplicably fond of bananas. You're an apple person yourself, but you file the information away for future reference. You never know when you might need to bribe a guard (or three)...",
        outro:"Awesome! Commander Lambda was so impressed by your efforts that she's made you her personal assistant. You'll be helping her directly with her work, which means you'll have access to all of her files-including the ones on the LAMBCHOP doomsday device. This is the chance you've been waiting for. Can you use your new access to finally topple Commander Lambda's evil empire?",
        year: 2023,
        type: "directory",
        parent: null,
        children: [
            {
            name: "readme.txt",
            type: "file",
            editable: false,
            parent: "lovely-lucky-lambs",
            content: `Lovely Lucky LAMBs
==================
Write a function named solution that takes a string as its parameter. Your function should extract and return the middle letter. If there is no middle letter, your function should return the empty string.

For example, solution("abc") should return "b" and mid("aaaa") should return "".`
            },
            {
            name: "solution.py",
            type: "file",
            editable: true,
            parent: "lovely-lucky-lambs",
            content: "# provide your solution here ...\ndef solution(string):\n   pass"
            }
        ]
    },
    {
        name: "bomb-baby",
        level: 3,
        question: 1,
        timeLimit: 24,
        intro:"As Commander Lambda's personal assistant, you get to deal with all of the paperwork involved in running a space station big enough to house the LAMBCHOP. And you thought Bunny HQ had too much bureaucracy...",
        outro:"Who the heck puts clover and coffee creamer in their tea? Commander Lambda, apparently. When you signed up to infiltrate her organization, you didn't think you'd get such an up-close and personal look at her more... unusual tastes.",
        year: 2023,
        type: "directory",
        parent: null,
        children: [
            {
            name: "readme.txt",
            type: "file",
            editable: false,
            parent: "bomb-baby",
            content: `Bomb Baby
==================
Two strings are anagrams if you can make one from the other by rearranging the letters.

Write a function named solution that takes two strings as its parameters. Your function should return True if the strings are anagrams, and False otherwise.

For example, the call solution("typhoon", "opython") should return True while the call solution("Alice", "Bob") should return False.`
            },
            {
            name: "solution.py",
            type: "file",
            editable: true,
            parent: "bomb-baby",
            content: "# provide your solution here ...\ndef solution(str1, str2):\n   pass"
            }
        ]
    },
    {
        name: "doomsday-fuel",
        level: 4,
        question: 1,
        timeLimit: 24,
        intro:"One of these days you're going to manage to glimpse Commander Lambda's password over her shoulder. But she's very careful about security, and you haven't managed it yet...",
        outro:"Excellent! You've destroyed Commander Lambda's doomsday device and saved Bunny Planet! But there's one small problem: the LAMBCHOP was a wool-y important part of her space station, and when you blew it up, you triggered a chain reaction that's tearing the station apart. Can you rescue the imprisoned bunnies and escape before the entire thing explodes?",
        year: 2023,
        type: "directory",
        parent: null,
        children: [
            {
            name: "readme.txt",
            type: "file",
            editable: false,
            parent: "doomsday-fuel",
            content: `Doomsday Fuel
==================
A string is a palindrome when it is the same when read backwards.

For example, the string "bob" is a palindrome. So is "abba". But the string "abcd" is not a palindrome, because "abcd" != "dcba".

Write a function named solution that takes a single string as its parameter. Your function should return True if the string is a palindrome, and False otherwise.`
            },
            {
            name: "solution.py",
            type: "file",
            editable: true,
            parent: "doomsday-fuel",
            content: "# provide your solution here ...\ndef solution(string):\n   pass"
            }
        ]
    },
    {
        name: "fuel-injection-perfection",
        level: 5,
        question: 1,
        timeLimit: 24,
        intro:"One of these days you're going to manage to glimpse Commander Lambda's password over her shoulder. But she's very careful about security, and you haven't managed it yet...",
        outro:"Excellent! You've destroyed Commander Lambda's doomsday device and saved Bunny Planet! ",
        year: 2023,
        type: "directory",
        parent: null,
        children: [
            {
            name: "readme.txt",
            type: "file",
            editable: false,
            parent: "fuel-injection-perfection",
            content: `Fuel Injection Perfection
==================
The goal of this challenge is to analyze a binary string consisting of only zeros and ones. Your code should find the biggest number of consecutive zeros in the string. For example, given the string:

"1001101000110"
The biggest number of consecutive zeros is 3.

Define a function named solution that takes a single parameter, which is the string of zeros and ones. Your function should return the number described above.`
            },
            {
            name: "solution.py",
            type: "file",
            editable: true,
            parent: "fuel-injection-perfection",
            content: "# provide your solution here ...\ndef solution(string):\n   pass"
            }
        ]
    },

]