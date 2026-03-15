import os
import re

DIR = "src"

MAPPINGS = {
    # Base backgrounds
    r'\bbg-white/80\b': 'bg-white/80 dark:bg-slate-900/80',
    r'\bbg-white/90\b': 'bg-white/90 dark:bg-slate-900/90',
    r'\bbg-white\b': 'bg-white dark:bg-slate-900',
    r'\bbg-slate-50\b': 'bg-slate-50 dark:bg-slate-950',
    r'\bbg-gray-50\b': 'bg-gray-50 dark:bg-slate-950',
    r'\bbg-slate-100\b': 'bg-slate-100 dark:bg-slate-800',
    r'\bbg-slate-200\b': 'bg-slate-200 dark:bg-slate-700',
    
    # Gradients
    r'\bfrom-slate-50\b': 'from-slate-50 dark:from-slate-950',
    r'\bvia-white\b': 'via-white dark:via-slate-900',
    r'\bto-purple-50\b': 'to-purple-50 dark:to-slate-950',
    r'\bto-blue-50\b': 'to-blue-50 dark:to-slate-900',

    # Text Colors
    r'\btext-slate-800\b': 'text-slate-800 dark:text-slate-100',
    r'\btext-slate-700\b': 'text-slate-700 dark:text-slate-200',
    r'\btext-slate-600\b': 'text-slate-600 dark:text-slate-300',
    r'\btext-slate-500\b': 'text-slate-500 dark:text-slate-400',
    r'\btext-gray-900\b': 'text-gray-900 dark:text-gray-100',
    r'\btext-gray-800\b': 'text-gray-800 dark:text-gray-200',
    r'\btext-gray-600\b': 'text-gray-600 dark:text-gray-300',
    
    # Borders
    r'\bborder-slate-100\b': 'border-slate-100 dark:border-slate-800',
    r'\bborder-slate-200\b': 'border-slate-200 dark:border-slate-700',
    r'\bborder-gray-100\b': 'border-gray-100 dark:border-gray-800',
    r'\bborder-gray-200\b': 'border-gray-200 dark:border-gray-700',
    
    # Hover States
    r'\bhover:bg-slate-100\b': 'hover:bg-slate-100 dark:hover:bg-slate-800',
    r'\bhover:bg-slate-50\b': 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    for pattern, replacement in MAPPINGS.items():
        if replacement not in content:
            content = re.sub(pattern, replacement, content)

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(DIR):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.tsx'):
            process_file(os.path.join(root, file))

print("Done applying dark mode classes.")
