import { createFileRoute } from "@tanstack/react-router";
import { Settings, BookOpen, Activity, Lock, Unlock, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "@/lib/store";

const C_CODES = [
  {
    id: 1,
    title: "Q1",
    code: `#include <stdio.h>

int main() {
    char str[100];
    int i = 0, count = 0;

    printf("Enter a string: ");
    scanf("%[^\\n]", str);

    while(str[i] != '\\0') {
        if(str[i]=='a' || str[i]=='e' || str[i]=='i' || str[i]=='o' || str[i]=='u' ||
           str[i]=='A' || str[i]=='E' || str[i]=='I' || str[i]=='O' || str[i]=='U') {
            count++;
        }
        i++;
    }

    printf("Number of vowels present: %d\\n", count);
    return 0;
}`
  },
  {
    id: 2,
    title: "Q2",
    code: `#include <stdio.h>

int main() {
    int arr1[10], arr2[10], sum[10], i;

    printf("Enter 10 elements for first array:\\n");
    for(i=0; i<10; i++) {
        scanf("%d", &arr1[i]);
    }

    printf("Enter 10 elements for second array:\\n");
    for(i=0; i<10; i++) {
        scanf("%d", &arr2[i]);
    }

    printf("Element-wise addition output:\\n");
    for(i=0; i<10; i++) {
        sum[i] = arr1[i] + arr2[i];
        printf("%d ", sum[i]);
    }
    printf("\\n");

    return 0;
}`
  },
  {
    id: 3,
    title: "Q3",
    code: `#include <stdio.h>

int main() {
    char str[100];
    int i = 0, len = 0, isPalindrome = 1;

    printf("Enter a word: ");
    scanf("%s", str);

    while(str[len] != '\\0') {
        len++;
    }

    for(i=0; i < len/2; i++) {
        if(str[i] != str[len-i-1]) {
            isPalindrome = 0;
            break;
        }
    }

    if(isPalindrome == 1) {
        printf("The word is a palindrome.\\n");
    } else {
        printf("The word is not a palindrome.\\n");
    }

    return 0;
}`
  },
  {
    id: 4,
    title: "Q4",
    code: `#include <stdio.h>

int main() {
    char name[100];
    int i = 0;

    printf("Input:\\nEnter a name: ");
    scanf("%[^\\n]", name);

    printf("Output:\\nAbbreviated name is: %c.", name[0]);

    while(name[i] != '\\0') {
        if(name[i] == ' ' && name[i+1] != '\\0') {
            printf("%c.", name[i+1]);
        }
        i++;
    }
    printf("\\n");

    return 0;
}`
  },
  {
    id: 5,
    title: "Q5",
    code: `#include <stdio.h>

int main() {
    char name[100];
    int i = 0, lastSpace = -1;

    printf("Input:\\nEnter a name: ");
    scanf("%[^\\n]", name);

    while(name[i] != '\\0') {
        if(name[i] == ' ') {
            lastSpace = i;
        }
        i++;
    }

    printf("Output:\\nAbbreviated name is: ");
    if(lastSpace != -1) {
        printf("%c.", name[0]);
        for(i=1; i<lastSpace; i++) {
            if(name[i] == ' ' && name[i+1] != ' ') {
                printf("%c.", name[i+1]);
            }
        }
        for(i=lastSpace+1; name[i] != '\\0'; i++) {
            printf("%c", name[i]);
        }
        printf("\\n");
    } else {
        printf("%s\\n", name);
    }

    return 0;
}`
  },
  {
    id: 6,
    title: "Q6",
    code: `#include <stdio.h>

int main() {
    int arr[10], i, num, square, found = -1;

    printf("Enter 10 integer elements:\\n");
    for(i=0; i<10; i++) {
        scanf("%d", &arr[i]);
    }

    printf("Enter an integer to square and search: ");
    scanf("%d", &num);
    square = num * num;

    for(i=0; i<10; i++) {
        if(arr[i] == square) {
            found = i;
            break;
        }
    }

    if(found != -1) {
        printf("Position of the square term: %d\\n", found + 1);
    } else {
        printf("SQUARE TERM NOT PRESENT\\n");
    }

    return 0;
}`
  },
  {
    id: 7,
    title: "Q7",
    code: `#include <stdio.h>

int main() {
    int arr[10], i, searchVal, found = -1;

    printf("Enter 10 integer values:\\n");
    for(i=0; i<10; i++) {
        scanf("%d", &arr[i]);
    }

    printf("Enter a value to search: ");
    scanf("%d", &searchVal);

    for(i=0; i<10; i++) {
        if(arr[i] == searchVal) {
            found = i;
            break;
        }
    }

    if(found != -1) {
        printf("Array index: %d\\n", found);
    } else {
        printf("NOT PRESENT\\n");
    }

    return 0;
}`
  },
  {
    id: 8,
    title: "Q8",
    code: `#include <stdio.h>

int main() {
    int arr[10], i, key, flag = 0;

    printf("Enter 10 integers for the array:\\n");
    for(i=0; i<10; i++) {
        scanf("%d", &arr[i]);
    }

    printf("Enter element to find using linear search: ");
    scanf("%d", &key);

    for(i=0; i<10; i++) {
        if(arr[i] == key) {
            printf("Element found at position %d.\\n", i + 1);
            flag = 1;
            break;
        }
    }

    if(flag == 0) {
        printf("Element not found in the array.\\n");
    }

    return 0;
}`
  }
];

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Tan bee" },
      { name: "description", content: "Manage your app preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [studyMode, setStudyMode] = useLocalStorage<boolean>("sh_study_mode", true);
  const [healthMode, setHealthMode] = useLocalStorage<boolean>("sh_health_mode", false);
  
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "020526") {
      setIsAdminUnlocked(true);
      setAdminError("");
    } else {
      setAdminError("Incorrect password");
    }
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <p className="font-mono text-[10px] tracking-[0.25em] text-ice/50 mb-2">// PREFERENCES</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Settings</h1>

      <div className="glass-card p-6 animate-rise">
        <p className="section-label mb-5">FEATURES</p>
        
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
          <div className="flex gap-4">
            <div className="mt-1 text-mint">
              <BookOpen className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-ice">Study Mode</p>
              <p className="text-sm text-ice/60 mt-1 max-w-[280px]">
                Enable advanced study features including the AI Study Buddy, Stopwatch, and Study Notes.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setStudyMode(!studyMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${studyMode ? 'bg-mint' : 'bg-white/20'}`}
          >
            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${studyMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 mt-4">
          <div className="flex gap-4">
            <div className="mt-1 text-rose">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-ice">Health & Wellness</p>
              <p className="text-sm text-ice/60 mt-1 max-w-[280px]">
                Enable the student health dashboard to track hydration, meals, sleep, and budget.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setHealthMode(!healthMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${healthMode ? 'bg-rose' : 'bg-white/20'}`}
          >
            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${healthMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="glass-card p-6 animate-rise mt-8">
        <div className="flex items-center gap-2 mb-5">
          {isAdminUnlocked ? <Unlock className="size-4 text-mint" /> : <Lock className="size-4 text-ice/50" />}
          <p className="section-label">ADMIN PANEL</p>
        </div>
        
        {!isAdminUnlocked ? (
          <form onSubmit={handleAdminUnlock} className="flex flex-col gap-3">
            <p className="text-sm text-ice/60 mb-2">Enter the admin password to unlock.</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-ice placeholder:text-ice/30 outline-none focus:border-mint/50 transition-colors"
              />
              <button 
                type="submit"
                className="rounded-xl bg-mint px-4 py-2.5 text-ink font-semibold hover:bg-mint/90 transition-colors"
              >
                Unlock
              </button>
            </div>
            {adminError && <p className="text-rose text-sm mt-1">{adminError}</p>}
          </form>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-mint">Admin panel unlocked.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {C_CODES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleCopy(q.id, q.code)}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <span className="font-semibold text-ice group-hover:text-mint transition-colors">{q.title} copy button</span>
                  {copiedId === q.id ? (
                    <Check className="size-4 text-mint" />
                  ) : (
                    <Copy className="size-4 text-ice/60 group-hover:text-mint transition-colors" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
