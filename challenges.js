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
    intro:"Next time Bunny HQ needs someone to infiltrate a space station to rescue prisoners, you're going to tell them to make sure 'stay up for 48 hours straight scrubbing toilets' is part of the job description. It's only fair to warn people, after all.",
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
        
        Who would've guessed? Doomsday devices take a LOT of power. Commander Lambda wants to supplement the LAMBCHOP's quantum antimatter reactor core with solar arrays, and she's tasked you with setting up the solar panels.
        
        Due to the nature of the space station's outer paneling, all of its solar panels must be squares. Fortunately, you have one very large and flat area of solar material, a pair of industrial-strength scissors, and enough MegaCorp Solar Tape(TM) to piece together any excess panel material into more squares. For example, if you had a total area of 12 square yards of solar material, you would be able to make one 3x3 square panel (with a total area of 9). That would leave 3 square yards, so you can turn those into three 1x1 square solar panels.
        
        Write a function answer(area) that takes as its input a single unit of measure representing the total area of solar panels you have (between 1 and 1000000 inclusive) and returns a list of the areas of the largest squares you could make out of those panels, starting with the largest squares first. So, following the example above, answer(12) would return [9, 1, 1, 1].
        
        Languages
        =========

        To provide a Python solution, edit solution.py
        
        Test cases
        ==========
        
        Inputs:
            (int) area = 12
        
        Output:
            (int list) [9, 1, 1, 1]
        
        Inputs:
            (int) area = 15324
        
        Output:
            (int list) [15129, 169, 25, 1]
        `
        },
        {
        name: "solution.py",
        type: "file",
        editable: true,
        parent: "solar-doomsday",
        content: "# provide your solution here ...\ndef solution():\n   pass"
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
            
            Oh no! Commander Lambda's latest experiment to improve the efficiency of her LAMBCHOP doomsday device has backfired spectacularly. She had been improving the structure of the ion flux converter tree, but something went terribly wrong and the flux chains exploded. Some of the ion flux converters survived the explosion intact, but others had their position labels blasted off. She's having her henchmen rebuild the ion flux converter tree by hand, but you think you can do it much more quickly - quickly enough, perhaps, to earn a promotion!
            
            Flux chains require perfect binary trees, so Lambda's design arranged the ion flux converters to form one. To label them, she performed a post-order traversal of the tree of converters and labeled each converter with the order of that converter in the traversal, starting at 1. For example, a tree of 7 converters would look like the following:
            \`\`\`
               7
             3   6
            1 2 4 5
            \`\`\`
            Write a function solution(h, q) - where h is the height of the perfect tree of converters and q is a list of positive integers representing different flux converters - which returns a list of integers p where each element in p is the label of the converter that sits on top of the respective converter in q, or -1 if there is no such converter.  For example, solution(3, [1, 4, 7]) would return the converters above the converters at indexes 1, 4, and 7 in a perfect binary tree of height 3, which is [3, 6, -1].
            
            The domain of the integer h is 1 <= h <= 30, where h = 1 represents a perfect binary tree containing only the root, h = 2 represents a perfect binary tree with the root and two leaf nodes, h = 3 represents a perfect binary tree with the root, two internal nodes and four leaf nodes (like the example above), and so forth.  The lists q and p contain at least one but no more than 10000 distinct integers, all of which will be between 1 and 2^h-1, inclusive.
            
            Languages
            =========
            
            To provide a Python solution, edit solution.py
            
            Test cases
            ==========
            Your code should pass the following test cases.
            
            Note that it may also be run against hidden test cases not shown here.
            
            Input:
            
            solution.solution(3, [7, 3, 5, 1])
            
            Output:
            
                -1,7,6,3
            
            Input:
            
            solution.solution(5, [19, 14, 28])
            
            Output:
            
                21,15,29
            
            Use verify [file] to test your solution and see how it does. When you are finished editing your code, use submit [file] to submit your answer. If your solution passes the test cases, it will be removed from your home folder.
            `
            },
            {
            name: "solution.py",
            type: "file",
            editable: true,
            parent: "ion-flux-relabeling",
            content: "# provide your solution here ...\ndef solution():\n   pass"
            }
        ]
    },
    {
        name: "lovely-lucky-lambs",
        level: 2,
        question: 1,
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
            
            Being a henchman isn't all drudgery. Occasionally, when Commander Lambda is feeling generous, she'll hand out Lucky LAMBs (Lambda's All-purpose Money Bucks). Henchmen can use Lucky LAMBs to buy things like a second pair of socks, a pillow for their bunks, or even a third daily meal!
            
            However, actually passing out LAMBs isn't easy. Each henchman squad has a strict seniority ranking which must be respected - or else the henchmen will revolt and you'll all get demoted back to minions again! 
            
            There are 4 key rules which you must follow in order to avoid a revolt:
            
            1. The most junior henchman (with the least seniority) gets exactly 1 LAMB.  (There will always be at least 1 henchman on a team.)
            2. A henchman will revolt if the person who ranks immediately above them gets more than double the number of LAMBs they do.
            3. A henchman will revolt if the amount of LAMBs given to their next two subordinates combined is more than the number of LAMBs they get.  (Note that the two most junior henchmen won't have two subordinates, so this rule doesn't apply to them.  The 2nd most junior henchman would require at least as many LAMBs as the most junior henchman.)
            4. You can always find more henchmen to pay - the Commander has plenty of employees.  If there are enough LAMBs left over such that another henchman could be added as the most senior while obeying the other rules, you must always add and pay that henchman.
            
            Note that you may not be able to hand out all the LAMBs. A single LAMB cannot be subdivided. That is, all henchmen must get a positive integer number of LAMBs.
            
            Write a function called solution(total_lambs), where total_lambs is the integer number of LAMBs in the handout you are trying to divide. It should return an integer which represents the difference between the minimum and maximum number of henchmen who can share the LAMBs (that is, being as generous as possible to those you pay and as stingy as possible, respectively) while still obeying all of the above rules to avoid a revolt.  For instance, if you had 10 LAMBs and were as generous as possible, you could only pay 3 henchmen (1, 2, and 4 LAMBs, in order of ascending seniority), whereas if you were as stingy as possible, you could pay 4 henchmen (1, 1, 2, and 3 LAMBs). Therefore, solution(10) should return 4-3 = 1.
            
            To keep things interesting, Commander Lambda varies the sizes of the Lucky LAMB payouts. You can expect total_lambs to always be a positive integer less than 1 billion (10 ^ 9).
            `
            },
            {
            name: "solution.py",
            type: "file",
            editable: true,
            parent: "lovely-lucky-lambs",
            content: "# provide your solution here ...\ndef solution():\n   pass"
            }
        ]
    }]



    // {
    //     name: "ion-flux-relabeling",
    //     level: 2,
    //     question: 1,
    //     timeLimit: 24,
    //     intro:"You got the guards to teach you a card game today, it's called Fizzbin. It's kind of pointless, but they seem to like it and it helps you pass the time while you work your way up to Commander Lambda's inner circle.",
    //     year: 2023,
    //     type: "directory",
    //     parent: null,
    //     children: [
    //         {
    //         name: "readme.txt",
    //         type: "file",
    //         editable: false,
    //         parent: "ion-flux-relabeling",
    //         content: ``
    //         },
    //         {
    //         name: "solution.py",
    //         type: "file",
    //         editable: true,
    //         parent: "challenge-1",
    //         content: "# provide your solution here ...\ndef solution():\n   pass"
    //         }
    //     ]
    // }

    {
        "level": 1,
        "year": 2023,
        "challengeName": "solar-doomsday",
        "question": 1,
        "code": "\nimport unittest\nfrom unittest import mock\nimport json\n\n\nclass SolutionTestCase(unittest.TestCase):\n    def test_solution_positive_numbers(self):\n        expected = 15\n        with mock.patch('builtins.print'):\n            result = solution(5, 10)\n\n        self.assertEqual(result, expected)\n\n\n    def test_solution_negative_numbers(self):\n        expected = -15\n        with mock.patch('builtins.print'):\n            result = solution(-5, -10)\n        self.assertEqual(result, expected)\n\n    def test_solution_zero(self):\n        expected = 0\n        with mock.patch('builtins.print'):\n            result = solution(0, 0)\n        self.assertEqual(result, expected)\n\n        \nclass CustomTestResult(unittest.TestResult):\n    def __init__(self, *args, **kwargs):\n        super().__init__(*args, **kwargs)\n        self.test_results = {}\n        self.results = []\n        self.status = ''\n\n    def addSuccess(self, test):\n        self.test_results[test] = \"passed\"\n\n    def addFailure(self, test, err):\n        self.test_results[test] = \"failed\"\n    \n    def populateResult(self):\n        if self.test_results and all(result == \"passed\" for result in self.test_results.values()):\n            self.status = 'passed'\n        else:\n            self.status = 'failed'\n        for index, (_, result) in enumerate(self.test_results.items()):\n            self.results.append({ \"test\": \"Test \" + str(index+1), \"result\" : result })\n            \n    def print_test_results(self):\n        self.populateResult()\n        output = {\"status\": self.status, \"results\": self.results}\n        json_output=json.dumps(output)\n        print(json_output)\n    \n\nif __name__ == '__main__':\n    suite = unittest.TestLoader().loadTestsFromTestCase(SolutionTestCase)\n    result = CustomTestResult()\n    suite.run(result)\n    result.print_test_results()\n    "
      }

    self.test_output = [f"Test{index+1}: {result}" for index, (_, result) in enumerate(self.test_results.items())]

    Output: 
 {
  status: 'ok',
  data: {
    output: '',
    stderr: 'Traceback (most recent call last):\n' +
      '  File "source.txt", line 62, in <module>\n' +
      '    result.print_test_results()\n' +
      '  File "source.txt", line 52, in print_test_results\n' +
      '    self.populateResult()\n' +
      '  File "source.txt", line 49, in populateResult\n' +
      '    self.test_output.append("Test"+ index+1 + ": " + result)\n' +
      "TypeError: Can't convert 'int' object to str implicitly\n",
    status: 'error\n',
    submission_id: 'e01507f1e95134171cda'
  }
}


Output: 
{
 status: 'ok',
 data: {
   output: '{"result": "ok", "output": "Test1: passed\\nTest2: passed\\nTest3: passed"}\n',
   stderr: '',
   status: 'success\n',
   submission_id: '913bef475d9d7e087cb2'
 }
}