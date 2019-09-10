import sys
import json

queues = []
tree = {}
numhaed = 4
with open(sys.argv[1]) as f:
    j = 0
    for line in f:
        queue = line.strip().upper()
        queues.append(queue)

        w = tree
        for i in range(numhaed):
            pair = queue[i * 2:(i + 1) * 2]
            subqueue = queue[:(i + 1) * 2]

            if i == numhaed - 1:
                if subqueue not in w:
                    w[subqueue] = []
                w[subqueue].append(j)
            else:
                if subqueue not in w:
                    w[subqueue] = {}

            w = w[subqueue]
        j += 1

sys.stdout.write('export const queueTree =')
print(json.dumps(tree, ensure_ascii=False, indent=2, sort_keys=True, separators=(',', ': ')).replace('"', "'"))

sys.stdout.write('export const queueList =')
print(json.dumps(queues, ensure_ascii=False, indent=2, sort_keys=True, separators=(',', ': ')).replace('"', "'"))
