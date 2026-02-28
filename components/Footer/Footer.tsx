import css from "./Footer.module.css";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className={css.footer}>
            <div className={css.content}>
                <p>
                    © {new Date().getFullYear()} NoteHub. All rights reserved.
                </p>
                <div className={css.wrap}>
                    <p>Developer: Yaremkevych</p>
                    <p>
                        Contact us:
                        <Link
                            href="mailto:jaremkiewicz1992@gmail.com"
                            target="_blank"
                        >
                            &nbsp;jaremkiewicz1992@gmail.com
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
