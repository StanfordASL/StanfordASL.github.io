from __future__ import annotations

from pathlib import Path
from subprocess import check_call, check_output

from bibtexparser import parse_file


def check_for_parsing_errors(bib_filename: str | Path):
    """Check whether there are any formatting errors in the bib file whatsoever, fail if yes."""
    db = parse_file(bib_filename)
    if len(db.failed_blocks) > 0:
        print(f"Error, bib file {bib_filename} failed to parse ##################################")
        for block in db.failed_blocks:
            print(f"Error on line: {block.start_line}")
            print()
            print(block.error)
            print()
            print(block.raw)
            print("----------------------------------------------------")
        print(f"#############################################################################")
    return db


def check_for_deleted_entries(bib_filename: str | Path):
    """Check if the new proposed bib lacks any entries that are present in previous main branch.
    Fail if yes."""
    current_commit = check_output(["git", "rev-parse", "HEAD"]).strip().decode("utf-8")
    main_diverge_branch = (
        check_output(["git", "merge-base", "HEAD", "main"]).strip().decode("utf-8")
    )
    db_new = check_for_parsing_errors(bib_filename)
    try:
        check_call(["git", "checkout", main_diverge_branch])
        db_main = parse_file(bib_filename)
        deleted_entries = set(e.key for e in db_main.entries) - set(e.key for e in db_new.entries)
        if len(deleted_entries) > 0:
            print(f"Error, the new bib file {bib_filename} deletes entries #######################")
            print(deleted_entries)
            print(f"#############################################################################")
            assert (
                False
            ), "Deleting entries is not supported, this build integrations must be force-skipped"
        new_entries = set(e.key for e in db_new.entries) - set(e.key for e in db_main.entries)
        for entry in new_entries:
            print(f"INFO: New entry: {entry}")
    finally:
        check_call(["git", "checkout", current_commit])


if __name__ == "__main__":
    check_for_parsing_errors("_bibliography/ASL_Bib.bib")
    check_for_deleted_entries("_bibliography/ASL_Bib.bib")