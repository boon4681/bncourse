import { json, redirect } from '@sveltejs/kit';
import process from 'node:process';

import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs"
import * as Path from 'node:path';

const root = Path.join(Path.resolve(Path.dirname('')), "./static/assets");


function isDir(path: string) {
    try {
        var stat = lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { path } = await request.json();
    if (Path.relative(root, Path.join(root, path)).startsWith("..")) {
        return json({ dir: [] });
    }

    const p = Path.resolve(root, path);
    if (existsSync(p)) {
        if (isDir(p)) {
            return json({
                dir:
                    readdirSync(p).map(a => {
                        return {
                            folder: isDir(Path.join(p, a)),
                            path: Path.relative(p, Path.resolve(p, a)),
                            relative: Path.relative(root, Path.resolve(p, a))
                        }
                    })

            });
        } else {
            throw redirect(301, Path.join("./assets/", path))
        }
    }

    return json({ dir: [] });
}