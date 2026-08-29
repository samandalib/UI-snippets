export type PlaygroundLang = {
  id: string;
  label: string;
  code: string;
};

export const BINARY_EXP_STDIN = "3 13 1000000007";
export const BINARY_EXP_STDOUT = "1594323";

export const BINARY_EXP_LANGUAGES: PlaygroundLang[] = [
  {
    id: "cpp",
    label: "C++ 17",
    code: `#include <iostream>
using namespace std;

long long power(long long a, long long b, long long m) {
    long long res = 1;
    for (a %= m; b > 0; b >>= 1, a = (a * a) % m)
        if (b & 1) res = (res * a) % m;
    return res;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b, m;
    if (cin >> a >> b >> m) cout << power(a, b, m) << "\\n";
    return 0;
}`,
  },
  {
    id: "python",
    label: "Python 3",
    code: `import sys

def power(a: int, b: int, m: int) -> int:
    res = 1
    a %= m
    while b > 0:
        if b & 1:
            res = (res * a) % m
        a = (a * a) % m
        b >>= 1
    return res

if __name__ == "__main__":
    tokens = sys.stdin.read().split()
    if tokens:
        a, b, m = map(int, tokens[:3])
        print(power(a, b, m))`,
  },
  {
    id: "java",
    label: "Java",
    code: `import java.util.Scanner;

public class Main {
    public static long power(long a, long b, long m) {
        long res = 1;
        a %= m;
        while (b > 0) {
            if ((b & 1) == 1) res = (res * a) % m;
            a = (a * a) % m;
            b >>= 1;
        }
        return res;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLong()) {
            long a = sc.nextLong(), b = sc.nextLong(), m = sc.nextLong();
            System.out.println(power(a, b, m));
        }
    }
}`,
  },
  {
    id: "c",
    label: "C11",
    code: `#include <stdio.h>

long long power(long long a, long long b, long long m) {
    long long res = 1;
    for (a %= m; b > 0; b >>= 1, a = (a * a) % m)
        if (b & 1) res = (res * a) % m;
    return res;
}

int main() {
    long long a, b, m;
    if (scanf("%lld %lld %lld", &a, &b, &m) == 3) {
        printf("%lld\\n", power(a, b, m));
    }
    return 0;
}`,
  },
  {
    id: "rust",
    label: "Rust",
    code: `use std::io::{self, Read};

fn power(mut a: u64, mut b: u64, m: u64) -> u64 {
    let mut res = 1;
    a %= m;
    while b > 0 {
        if b & 1 == 1 { res = (res * a) % m; }
        a = (a * a) % m;
        b >>= 1;
    }
    res
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();
    if let (Some(a), Some(b), Some(m)) = (iter.next(), iter.next(), iter.next()) {
        let (a, b, m): (u64, u64, u64) =
            (a.parse().unwrap(), b.parse().unwrap(), m.parse().unwrap());
        println!("{}", power(a, b, m));
    }
}`,
  },
  {
    id: "go",
    label: "Go",
    code: `package main

import "fmt"

func power(a, b, m int64) int64 {
    var res int64 = 1
    a %= m
    for b > 0 {
        if b&1 == 1 { res = (res * a) % m }
        a = (a * a) % m
        b >>= 1
    }
    return res
}

func main() {
    var a, b, m int64
    if _, err := fmt.Scan(&a, &b, &m); err == nil {
        fmt.Println(power(a, b, m))
    }
}`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    code: `const fs = require('fs');

function power(a, b, m) {
    let res = 1n;
    a = a % m;
    while (b > 0n) {
        if (b & 1n) res = (res * a) % m;
        a = (a * a) % m;
        b >>= 1n;
    }
    return res;
}

const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (tokens.length >= 3) {
    const [a, b, m] = tokens.slice(0, 3).map(BigInt);
    console.log(power(a, b, m).toString());
}`,
  },
  {
    id: "typescript",
    label: "TypeScript",
    code: `import * as fs from 'fs';

function power(a: bigint, b: bigint, m: bigint): bigint {
    let res: bigint = 1n;
    a %= m;
    while (b > 0n) {
        if (b & 1n) res = (res * a) % m;
        a = (a * a) % m;
        b >>= 1n;
    }
    return res;
}

const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (tokens.length >= 3) {
    const [a, b, m] = tokens.slice(0, 3).map(BigInt);
    console.log(power(a, b, m).toString());
}`,
  },
  {
    id: "csharp",
    label: "C#",
    code: `using System;

class Program {
    static long Power(long a, long b, long m) {
        long res = 1;
        a %= m;
        while (b > 0) {
            if ((b & 1) == 1) res = (res * a) % m;
            a = (a * a) % m;
            b >>= 1;
        }
        return res;
    }

    static void Main() {
        string[] tokens = (Console.ReadLine() ?? "")
            .Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        if (tokens.Length >= 3) {
            long a = long.Parse(tokens[0]);
            long b = long.Parse(tokens[1]);
            long m = long.Parse(tokens[2]);
            Console.WriteLine(Power(a, b, m));
        }
    }
}`,
  },
  {
    id: "kotlin",
    label: "Kotlin",
    code: `import java.util.Scanner

fun power(a0: Long, b0: Long, m: Long): Long {
    var a = a0
    var b = b0
    var res = 1L
    a %= m
    while (b > 0L) {
        if ((b and 1L) == 1L) res = (res * a) % m
        a = (a * a) % m
        b = b shr 1
    }
    return res
}

fun main() {
    val sc = Scanner(System.\`in\`)
    if (sc.hasNextLong()) {
        val a = sc.nextLong()
        val b = sc.nextLong()
        val m = sc.nextLong()
        println(power(a, b, m))
    }
}`,
  },
  {
    id: "swift",
    label: "Swift",
    code: `import Foundation

func power(_ base: UInt64, _ exp: UInt64, _ mod: UInt64) -> UInt64 {
    var res: UInt64 = 1
    var a = base % mod
    var b = exp
    while b > 0 {
        if (b & 1) == 1 { res = (res * a) % mod }
        a = (a * a) % mod
        b >>= 1
    }
    return res
}

if let line = readLine() {
    let parts = line.split(separator: " ").compactMap { UInt64($0) }
    if parts.count >= 3 {
        print(power(parts[0], parts[1], parts[2]))
    }
}`,
  },
  {
    id: "ruby",
    label: "Ruby",
    code: `def power(a, b, m)
  res = 1
  a %= m
  while b > 0
    res = (res * a) % m if (b & 1) == 1
    a = (a * a) % m
    b >>= 1
  end
  res
end

input = ARGF.read.split.map(&:to_i)
if input.length >= 3
  puts power(input[0], input[1], input[2])
end`,
  },
  {
    id: "php",
    label: "PHP",
    code: `<?php
function power($a, $b, $m) {
    $res = 1;
    $a %= $m;
    while ($b > 0) {
        if ($b & 1) $res = ($res * $a) % $m;
        $a = ($a * $a) % $m;
        $b >>= 1;
    }
    return $res;
}

$tokens = preg_split('/\\s+/', trim(file_get_contents('php://stdin')));
if (count($tokens) >= 3) {
    echo power((int)$tokens[0], (int)$tokens[1], (int)$tokens[2]) . "\\n";
}`,
  },
  {
    id: "haskell",
    label: "Haskell",
    code: `import System.IO (getContents)

power :: Integer -> Integer -> Integer -> Integer
power _ 0 _ = 1
power a b m
  | even b    = power ((a * a) \`mod\` m) (b \`div\` 2) m
  | otherwise = (a * power a (b - 1) m) \`mod\` m

main :: IO ()
main = do
  input <- getContents
  case map read (words input) of
    (a : b : m : _) -> print $ power (a \`mod\` m) b m
    _               -> return ()`,
  },
];
