# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: MIT

import logging
import os
from dataclasses import dataclass, field, fields
from typing import Any, Optional

from langchain_core.runnables import RunnableConfig

from src.config.report_style import ReportStyle
from src.rag.retriever import Resource

logger = logging.getLogger(__name__)

_TRUTHY = {"1", "true", "yes", "y", "on"}


def get_bool_env(name: str, default: bool = False) -> bool:
    val = os.getenv(name)
    if val is None:
        return default
    return str(val).strip().lower() in _TRUTHY


def get_str_env(name: str, default: str = "") -> str:
    val = os.getenv(name)
    return default if val is None else str(val).strip()


def get_int_env(name: str, default: int = 0) -> int:
    val = os.getenv(name)
    if val is None:
        return default
    try:
        return int(val.strip())
    except ValueError:
        logger.warning(
            f"Invalid integer value for {name}: {val}. Using default {default}."
        )
        return default


def get_recursion_limit(default: int = 25) -> int:
    """Get the recursion limit from environment variable or use default.

    Args:
        default: Default recursion limit if environment variable is not set or invalid

    Returns:
        int: The recursion limit to use
    """
    env_value_str = get_str_env("AGENT_RECURSION_LIMIT", str(default))
    parsed_limit = get_int_env("AGENT_RECURSION_LIMIT", default)

    if parsed_limit > 0:
        logger.info(f"Recursion limit set to: {parsed_limit}")
        return parsed_limit
    else:
        logger.warning(
            f"AGENT_RECURSION_LIMIT value '{env_value_str}' (parsed as {parsed_limit}) is not positive. "
            f"Using default value {default}."
        )
        return default


@dataclass(kw_only=True)
class Configuration:
    """The configurable fields."""

    resources: list[Resource] = field(
        default_factory=list
    )  # Resources to be used for the research
    max_plan_iterations: int = 1  # Maximum number of plan iterations
    max_step_num: int = 3  # Maximum number of steps in a plan
    max_search_results: int = 3  # Maximum number of search results
    mcp_settings: dict = None  # MCP settings, including dynamic loaded tools
    report_style: str = ReportStyle.ACADEMIC.value  # Report style
    enable_deep_thinking: bool = False  # Whether to enable deep thinking

    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> "Configuration":
        """Create a Configuration instance from a RunnableConfig."""
        configurable = (
            config["configurable"] if config and "configurable" in config else {}
        )
        values: dict[str, Any] = {
            f.name: os.environ.get(f.name.upper(), configurable.get(f.name))
            for f in fields(cls)
            if f.init
        }
        return cls(**{k: v for k, v in values.items() if v})
